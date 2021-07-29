function drawLighsaber() {
  // @snippet:start(first)
  const lightsaber = new Lightsaber();
  luke.draw(lightsaber);
  luke.swingLightsaber();
  // @snippet:end
}

// @snippet:start(second)
function useForce() {
  luke.concentrate();
  luke.feelTheForce();
  luke.push(stormtrooper);
}
// @snippet:end
