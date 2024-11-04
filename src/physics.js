import * as CANNON from "cannon-es";

export function initPhysicsWorld() {
    const world = new CANNON.World();
    world.gravity.set(0, 0, 0);
    return world;
}

export function setMinimumVelocity(body, minVelocity) {
    const velocityMagnitude = body.velocity.length();
    if (velocityMagnitude < minVelocity) {
        const scaleFactor = minVelocity / velocityMagnitude;
        body.velocity.scale(scaleFactor);
    }
}

export const boundarySizes = {
    x: 2000,  // Dimensione per l'asse X
    y: 1000,  // Dimensione per l'asse Y
    z: 1000   // Dimensione per l'asse Z
};

export const shifts = {
    x: 0,  // Traslazione per l'asse X
    y: 1500,     // Traslazione per l'asse Y
    z: 1500   // Traslazione per l'asse Z
};

export function checkBoundsAndBounce(body, boundarySizes, shifts) {
    const { x, y, z } = body.position;

    // boundarySizes dovrebbe essere un oggetto con tre proprietà: x, y e z
    const { x: boundaryX, y: boundaryY, z: boundaryZ } = boundarySizes;

    // shifts dovrebbe essere un oggetto con le stesse proprietà per la traslazione
    const { x: shiftX, y: shiftY, z: shiftZ } = shifts;

    // Controllo e rimbalzo per l'asse X
    if (x < -boundaryX + shiftX || x > boundaryX + shiftX) {
        body.velocity.x *= -1; // Rimbalza sull'asse X
        // Riposizionamento per evitare che esca dai confini
        body.position.x = Math.max(-boundaryX + shiftX, Math.min(boundaryX + shiftX, x));
    }

    // Controllo e rimbalzo per l'asse Y
    if (y < -boundaryY + shiftY || y > boundaryY + shiftY) {
        body.velocity.y *= -1; // Rimbalza sull'asse Y
        body.position.y = Math.max(-boundaryY + shiftY, Math.min(boundaryY + shiftY, y));
    }

    // Controllo e rimbalzo per l'asse Z
    if (z < -boundaryZ + shiftZ || z > boundaryZ + shiftZ) {
        body.velocity.z *= -1; // Rimbalza sull'asse Z
        body.position.z = Math.max(-boundaryZ + shiftZ, Math.min(boundaryZ + shiftZ, z));
    }
}


export function updatePhysicsObjects(scene, world) {
    scene.traverse((child) => {
        if (child.isGroup && child.userData.physicsBody) {
            const body = child.userData.physicsBody;
            
            
           // setMinimumVelocity(body, 5); // Usa il valore di minVelocity
            child.position.copy(body.position);
            child.quaternion.copy(body.quaternion);


            if (body && child.userData.boxHelper) {
                child.userData.boxHelper.position.copy(body.position);
                child.userData.boxHelper.quaternion.copy(body.quaternion);  // Mantiene la stessa rotazione
            }
            checkBoundsAndBounce(body, boundarySizes, shifts);
            //child.userData.boxHelper.update();
        }
    });
}
