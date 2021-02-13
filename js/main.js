{
    const wrapper = document.getElementById("renderer-wrapper");
    const renderer = document.getElementById("renderer");
    const symmetry = new Symmetry(renderer);
    let lastTime = performance.now();

    renderer.width = wrapper.clientWidth;
    renderer.height = wrapper.clientHeight;

    window.onresize = () => {
        renderer.width = wrapper.clientWidth;
        renderer.height = wrapper.clientHeight;

        symmetry.resize(renderer.width, renderer.height);
    };

    symmetry.resize(renderer.width, renderer.height);

    const loop = time => {
        symmetry.draw(.001 * (time - lastTime));

        lastTime = time;

        requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);

    new Interface(
        symmetry,
        document.getElementById("interface-root"),
        document.getElementById("interface-planes"));
}