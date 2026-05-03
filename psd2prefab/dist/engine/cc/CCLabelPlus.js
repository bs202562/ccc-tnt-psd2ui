"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelPlus = void 0;
const EditorVersion_1 = require("../../EditorVersion");
const _decorator_1 = require("../../_decorator");
const CCLabel_1 = require("./CCLabel");
const Vec2_1 = require("../../values/Vec2");
let LabelPlus = class LabelPlus extends CCLabel_1.CCLabel {
    constructor() {
        super(...arguments);
        this._outline = false;
        this._outlineThickness = 0.3;
        this._shadow = false;
        this._shadowOffset = new Vec2_1.Vec2(0, 0);
    }
};
exports.LabelPlus = LabelPlus;
__decorate([
    (0, _decorator_1.ccversion)(EditorVersion_1.EditorVersion.all)
], LabelPlus.prototype, "_outline", void 0);
__decorate([
    (0, _decorator_1.ccversion)(EditorVersion_1.EditorVersion.all)
], LabelPlus.prototype, "_outlineThickness", void 0);
__decorate([
    (0, _decorator_1.ccversion)(EditorVersion_1.EditorVersion.all)
], LabelPlus.prototype, "_shadow", void 0);
__decorate([
    (0, _decorator_1.ccversion)(EditorVersion_1.EditorVersion.all)
], LabelPlus.prototype, "_shadowOffset", void 0);
exports.LabelPlus = LabelPlus = __decorate([
    (0, _decorator_1.cctype)("LabelPlus")
], LabelPlus);
