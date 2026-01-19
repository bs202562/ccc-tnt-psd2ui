#!/bin/sh

cur_dir=$(dirname $0)
plugin_dir=$(dirname $(dirname $cur_dir))
builtin_node="$plugin_dir/bin/node"

# 优先使用内嵌的 node，如果没有则使用系统 node
if [ -x "$builtin_node" ]; then
    "$builtin_node" "$cur_dir/index.js" $1 $2
else
    echo "[psd2ui] 使用系统 node"
    node "$cur_dir/index.js" $1 $2
fi

# echo 请按任意键继续..
# read -n 1