async function init() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  if (!navigator.gpu) {
    console.error('WebGPU is not supported in this browser.');
    return;
  }

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    console.error('Failed to get GPU adapter.');
    return;
  }

  const device = await adapter.requestDevice();
  const context = canvas.getContext('webgpu')!;
  const format = navigator.gpu.getPreferredCanvasFormat();

  context.configure({ device, format });

  const resize = () => {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
  };
  window.addEventListener('resize', resize);
  resize();

  function frame() {
    const encoder = device.createCommandEncoder();
    const pass = encoder.beginRenderPass({
      colorAttachments: [{
        view: context.getCurrentTexture().createView(),
        clearValue: { r: 0.05, g: 0.05, b: 0.08, a: 1.0 },
        loadOp: 'clear',
        storeOp: 'store',
      }],
    });
    pass.end();
    device.queue.submit([encoder.finish()]);
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

init();
