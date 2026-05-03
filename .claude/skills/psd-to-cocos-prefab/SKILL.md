---
name: psd-to-cocos-prefab
description: Convert Photoshop .psd files to Cocos Creator 3.4+ prefab + .png + .meta using the ccc-tnt-psd2ui plugin's bundled CLI. Trigger when the user asks to turn a PSD into a Cocos prefab/UI, mentions ccc-tnt-psd2ui / psd2ui / psd2prefab, has a .psd they want to import into a Cocos project, or works in a directory containing the ccc-tnt-psd2ui-v3.4.+ plugin.
---

# psd → Cocos Creator 3.4+ prefab

The `ccc-tnt-psd2ui` plugin has a CLI bundle at `ccc-tnt-psd2ui-v3.4.+/libs/psd2ui/index.js` that walks a PSD's layers, splits images, and emits a `.prefab` + `.png` + `.png.meta` set ready for Cocos Creator to import.

It's the same code the editor panel calls when the user drops a PSD into the drop area; running it directly skips the editor.

## When NOT to use this

- The user wants a Godot scene → use `psd-to-godot-tscn`.
- The user wants the reverse direction (prefab → psd) → use `cocos-prefab-to-psd`.
- The PSD has no `@xxx` layer-name tags AND no clean group structure → the output may be garbage. Tell the user to follow the README's layer-name conventions first.

## Invocation

The CLI must be run with the plugin's bundled Node (used to be `bin/node.exe`, recently bumped to system Node 22). The convenience wrapper is `libs/psd2ui/command.bat` (Windows) or `command.sh` (mac/linux). Use the wrapper unless you need to override the Node binary.

```bash
# Direct invocation (preferred when scripting)
node ccc-tnt-psd2ui-v3.4.+/libs/psd2ui/index.js \
  --input <path-to-psd-or-dir> \
  --project-assets <cocos-project>/assets \
  --cache <cocos-project>/local/psd-to-prefab-cache.json \
  --engine-version v342 \
  --pinyin

# Via the convenience wrapper
ccc-tnt-psd2ui-v3.4.+/libs/psd2ui/command.bat --input ./your.psd --project-assets ./assets --cache ./local/psd-to-prefab-cache.json --engine-version v342 --pinyin
```

### Flags

| Flag | Required | Notes |
| --- | --- | --- |
| `--input` | yes | `.psd` file OR directory containing PSDs (recursive) |
| `--project-assets` | yes | Cocos project's `assets/` dir; outputs land here unless `--output` given |
| `--cache` | yes | `local/psd-to-prefab-cache.json` — md5→spriteFrameUuid cache, makes re-imports skip same-image re-export |
| `--engine-version` | yes | `v342` for Cocos 3.4+ (the only supported one in this build); `v249` for legacy 2.4.x |
| `--output` |  | Override output dir; defaults to `<psd-dir>` |
| `--pinyin` |  | Strongly recommended — converts Chinese layer names to pinyin so node names / file paths are ASCII |
| `--force-img` |  | Re-export images even if md5 already cached |
| `--img-only` |  | Slice images only, do not generate `.prefab` (useful as an export-only mode) |
| `--config` |  | Path to `psd.config.json` (text Y offset tuning, default font, etc.) |
| `--init` |  | Just scan `--project-assets` to seed the cache; no PSD conversion |

The CLI also accepts `--json <base64>` where the base64-decoded JSON is the args object — that's how the editor's `dist/main.js` invokes it. You don't need this when calling directly.

## Layer-name conventions the plugin understands

(Fully documented in `ccc-tnt-psd2ui-v3.4.+/README.md`.)

| Tag | Purpose |
| --- | --- |
| `@Btn` / `@btn` | Wrap node in `cc.Button` |
| `@Toggle` / `@toggle` (group) + `@check` (child sprite) | `cc.Toggle` + checkmark |
| `@ProgressBar` / `@progressBar` (group) + `@bar` (child sprite) | `cc.ProgressBar` |
| `@.9{l:N,r:N,t:N,b:N}` | 9-slice border for `cc.Sprite` |
| `@ar{x:N,y:N}` | Anchor point (default 0.5/0.5) |
| `@full` | Full-rect node (Widget anchored to all edges) |
| `@img{name,id,bind}` | Image options + cross-layer bind |
| `@flip` / `@flipX` / `@flipY` | Flip a referenced image (no extra image export) |
| `@ignore` / `@ignorenode` / `@ignoreimg` | Skip node and/or image |

Multiple tags can stack on one layer: `<name>@Btn@ar{x:1,y:1}@.9{l:8,r:8,t:8,b:8}`.

## Outputs

For a PSD `MyUI.psd` with layers `Bg / OkBtn / Label`, the plugin writes (relative to `--output` or `<psd-dir>`):

```
MyUI/
  MyUI.prefab          # the Cocos prefab JSON
  MyUI.prefab.meta
  textures/
    <md5>.png          # one per unique image (filename = md5 of pixel bytes)
    <md5>.png.meta
```

The `.meta` files contain stable Cocos uuids derived per-PSD; they're idempotent across runs.

## md5 cache

`local/psd-to-prefab-cache.json` is keyed by md5 of the exported PNG bytes:

```json
{
  "<md5>": { "path": "...", "textureUuid": "...", "uuid": "...", "isOutput": true }
}
```

On every run the importer recomputes md5 of each layer's pixels; if the md5 is already in the cache, it reuses the existing texture uuid and skips writing the PNG. This is also how `cocos-prefab-to-psd` makes the round-trip work — it pre-populates the cache with predicted md5s so re-imports of the generated PSD short-circuit.

## Common gotchas

- **CocosCreator must be closed (or the assets reloaded)** when overwriting prefabs/PNGs in `assets/` — the editor caches them.
- **`--engine-version v342`** is required; without it the CLI falls back to a default that may not match the editor's expectations. The plugin's editor-side handler always passes `v342`.
- **The CLI bundle is auto-updated** by `dist/updater.js` from the upstream repo. If a future user reports the bundle is different from this version, they may have a newer one — check `ccc-tnt-psd2ui-v3.4.+/libs/psd2ui/index.js` first, don't assume.
- **Output dir must NOT be inside `<cocos-project>/assets`** if you're writing while the editor is open — Cocos may grab the file mid-write. The README explicitly warns about this.
- **First run on a project should be `--init` only** to seed the md5 cache from existing project PNGs; then run real conversions.

## Editor wiring

In a Cocos project that has the plugin installed, the user can also invoke it via the panel: `菜单/扩展/psd转预制体` opens a window with a drop area. That panel calls the same CLI under the hood. There's no need to use the panel from the AI's side — direct CLI calls are easier to script.
