export const Utilities = {
  getPositionOfNode: (element, viewer, model) => {
    //const boundingBox = viewer.utilities.getBoundingBox(element);

    //console.log(`${element.name} has bound boxes of `, viewer.impl.getFragmentProxy(model, element.dbId).frags.geoms.geomBoxes)
    return;
    const boundingBox = viewer.impl.get3DBounds(element);

    const max = boundingBox.max;
    const min = boundingBox.min;

    const width = max.x - min.x;
    const height = max.y - min.y;
    const depth = max.z - min.z;

    const points = [
      { x: min.x, y: min.y, z: min.z }, // Min point
      { x: max.x, y: min.y, z: min.z },
      { x: min.x, y: max.y, z: min.z },
      { x: max.x, y: max.y, z: min.z },

      { x: min.x, y: min.y, z: max.z },
      { x: max.x, y: min.y, z: max.z },
      { x: min.x, y: max.y, z: max.z },
      { x: max.x, y: max.y, z: max.z }, // Max point
    ];

    console.log(`${element.name} has bound box of `, boundingBox);
  },
  pointIsInsideBox: (box, point) => {
    const { min, max } = box;

    return (
      point.x >= min.x &&
      point.x <= max.x &&
      point.y >= min.y &&
      point.y <= max.y &&
      point.z >= min.z &&
      point.z <= max.z
    );
  },
  getElementsContainingPoint: (viewer, point) => {
    //debugger;
    const frags = viewer.model.getFragmentList();

    const ids = new Set([]);

    for (let index = 0; index < frags.getCount(); index++) {
      let bbox = new THREE.Box3();
      frags.getWorldBounds(index, bbox);
      if (Utilities.pointIsInsideBox(bbox, point)) {
        //debugger;
        ids.add(frags.getDbIds(index));
        //console.log(`has bound boxes of `, bbox);
        let center = bbox.center();
        //console.log(center);
      }
    }
    //console.log(ids);
    return ids;
  },
  getObjectsIntersectingRaycast: (viewer, objects) => {
    debugger;
    var camera = viewer.getCamera();
    var origin = camera.position.clone();
    var direction = new THREE.Vector3(0, 0, -1).applyQuaternion(
      camera.quaternion
    );
    var raycaster = new THREE.Raycaster(origin, direction);

    // get objects intersect with raycaster
    var intersects = raycaster.intersectObjects(objects);

    debugger
    intersects.forEach(element => {
      viewer.hide(element.object.userData.bdId);
    });
  },

  getMeshes: (viewer) => {
    const frags = viewer.model.getFragmentList();
    const meshes = [];

    for (let index = 0; index < frags.getCount(); index++) {
      let box3 = new THREE.Box3();
      frags.getWorldBounds(index, box3);
      const material = new THREE.MeshStandardMaterial();

      // make a BoxBufferGeometry of the same size as Box3
      const dimensions = new THREE.Vector3().subVectors(box3.max, box3.min);
      const boxGeo = new THREE.BoxBufferGeometry(
        dimensions.x,
        dimensions.y,
        dimensions.z
      );

      // move new mesh center so it's aligned with the original object
      const matrix = new THREE.Matrix4().setPosition(
        dimensions.addVectors(box3.min, box3.max).multiplyScalar(0.5)
      );
      boxGeo.applyMatrix(matrix);

      // make a mesh
      const mesh = new THREE.Mesh(
        boxGeo,
        new THREE.MeshBasicMaterial({ color: 0xffcc55 })
      );

      mesh.userData.bdId = frags.getDbIds(index);
      meshes.push(mesh);
    }

    return meshes;
  },
};
