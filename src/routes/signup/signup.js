var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var _this = this;
var express = require("express");
var _a = require("express-validator"), body = _a.body, validationResult = _a.validationResult, matchedData = _a.matchedData;
var _b = require("../../config/userDB/userdb"), findUsers = _b.findUsers, findUser = _b.findUser, createUser = _b.createUser, findUserById = _b.findUserById;
var router = express.Router();
require("dotenv").config();
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var refreshToken = require("../../utils/generateRefreshToken/generateRefreshToken").refreshToken;
function server_response(status, response, message, options) {
    if (status === void 0) { status = 200; }
    if (message === void 0) { message = ""; }
    if (options === void 0) { options = {}; }
    response.header("Access-Control-Allow-Origin", process.env.ACCESS_CONTROL_ALLOW_ORIGIN);
    response.header("Access-Control-Allow-Methods", "GET, OPTIONS, POST, PUT, DELETE");
    response.header("Access-Control-Allow-Credentials", "true");
    true;
    response.status(status);
    response.header("Content-Type", "application/json");
    response.json(__assign({ status: status, message: message }, options));
}
router.post("/", [
    body("email")
        .trim()
        .notEmpty()
        .isEmail()
        .withMessage("Email address incorrect"),
    body("password")
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("Password should be at least 8 character"),
], function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var result, data, isUserExist, password, userCreated, _a, password_1, user, _b, token, _c, _d;
    var _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                result = validationResult(req);
                if (!result.isEmpty()) return [3 /*break*/, 8];
                data = matchedData(req);
                return [4 /*yield*/, findUser(data)];
            case 1:
                isUserExist = _f.sent();
                if (isUserExist) {
                    return [2 /*return*/, server_response(401, res, "Email address is taken!")];
                }
                return [4 /*yield*/, bcrypt.hash(data.password, 13)];
            case 2:
                password = _f.sent();
                return [4 /*yield*/, createUser({ email: data.email, password: password })];
            case 3:
                userCreated = _f.sent();
                if (!userCreated.acknowledged) return [3 /*break*/, 7];
                _b = userCreated.insertedId;
                if (!_b) return [3 /*break*/, 5];
                return [4 /*yield*/, findUserById(userCreated.insertedId)];
            case 4:
                _b = (_f.sent());
                _f.label = 5;
            case 5:
                _a = _b, password_1 = _a.password, user = __rest(_a, ["password"]);
                token = jwt.sign(__assign({}, user), process.env.JWT_SECRET_KEY, {
                    expiresIn: "1h",
                });
                _c = server_response;
                _d = [200, res, "Created successfully!"];
                _e = {
                    token: token
                };
                return [4 /*yield*/, refreshToken()];
            case 6: return [2 /*return*/, _c.apply(void 0, _d.concat([(_e.refresh_Token = _f.sent(),
                        _e)]))];
            case 7: return [2 /*return*/, server_response(500, res, "Unexpected error occurred, user not created!")];
            case 8:
                res.send({ error: result.array() });
                return [2 /*return*/];
        }
    });
}); });
module.exports = router;
