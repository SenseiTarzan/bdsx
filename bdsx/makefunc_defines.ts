import { uv_async } from "./core";

export const makefuncDefines = {
    fn_JsCreateError: -0x68,
    fn_getout: -0x58,
    fn_wrapper_np2js_nullable: -0x50,
    fn_str_np2js: -0x48,
    fn_str_js2np: -0x40,
    fn_stack_free_all: -0x38,
    fn_utf16_js2np: -0x30,
    fn_pointer_js2np: -0x28,
    fn_bin64: -0x20,
    fn_JsNumberToInt: -0x18,
    fn_JsBoolToBoolean: -0x10,
    fn_JsBooleanToBool: -0x08,
    fn_getout_invalid_parameter: 0x0,
    fn_JsIntToNumber: 0x08,
    fn_JsNumberToDouble: 0x10,
    fn_buffer_to_pointer: 0x18,
    fn_JsDoubleToNumber: 0x20,
    fn_JsPointerToString: 0x28,
    fn_ansi_np2js: 0x30,
    fn_utf8_np2js: 0x38,
    fn_utf16_np2js: 0x40,
    fn_pointer_np2js: 0x48,
    fn_pointer_np2js_nullable: 0x50,
    fn_getout_invalid_parameter_count: 0x58,
    fn_JsCallFunction: 0x60,
    fn_pointer_js_new: 0x68,
    fn_JsSetException: 0x70,
    fn_returnPoint: 0x78, // if first bit is on, it's the native wrapper.need to go runtime error
    
    asyncSize: uv_async.sizeOfTask,
};
