export const config = {
  timeline: {},
  scene: {},
  camera: {
    progress: {
      step:[-1, 0.04,.2,.5,.7,1]
    },
    curve: {
      step: [
        { x: 0, y: 0, z: 1.5},
        { x: 0, y: 0, z: -13.8},
        { x: 0, y: 0, z: -125},
        { x: 60, y: 0, z: -125},
        { x: 60, y: 0, z: -127},
        { x: 60, y: 0, z: -177},
      ],
    },
  },

  background: {
    bg2: {
      start: -5,
      end: -32,
    },
    bg3: {
      start: -36,
      end: -124,
    },
    bg4: {
      start: -120,
      end: -146,
    },
    bg5: {
      start: -148,
      end: -170,
    },
    bg6: {
      start: -170,
      end: -200,
    },
  },

  planes : {
    panels: {
      position: {
        x: 64,
        y: -2,
        z:  -135.5,
      }
    },
    mountain: {
      position: {
        x: 50,
        y: -10,
        z:  -150.5,
      }
    }
  },

  models: {
    hill: {
      position: {
        x: 0,
        y: -4.5,
        z: -20,
      },
    },
    globe: {
      position: {
        x: 0,
        y: 0,
        z: -0.6,
      },
    },
    person1: {
      position: {
        x: 59.7,
        y: -0.6,
        z: -160,
      },
    },
    person2: {
      position: {
        x: 60.1,
        y: -0.3,
        z: -162,
      },
    },
    person3: {
      position: {
        x: 60.1,
        y: -0.3,
        z: -164,
      },
    },
    molecules1: {
      position: {
        x: 60,
        y: -0.3,
        z: -176,
      },
    },
    molecules2: {
      position: {
        x: 61.4,
        y: -0.1,
        z: -179,
      },
    },
  },
};
