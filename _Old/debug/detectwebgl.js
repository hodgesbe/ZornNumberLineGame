/**
 * Created by Benjamin on 9/23/2015.
 */
function webgl_detect()
{
    if (!!window.WebGLRenderingContext) {
        var canvas = document.createElement("canvas"),
            names = ["webgl", "experimental-webgl", "moz-webgl"],
            gl = false;

        for(var i in names) {
            try {
                gl = canvas.getContext(names[i]);
                if (gl && typeof gl.getParameter == "function") {
                    /* WebGL is enabled */
                    /* return true; */
                    return names[i];
                }
            } catch(e) {}
        }

        /* WebGL is supported, but disabled */
        return false;
    }

    /* WebGL not supported*/
    return false;
}