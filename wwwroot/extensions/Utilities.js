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
        ids.add(frags.getDbIds(index))
        //console.log(`has bound boxes of `, bbox);
        let center = bbox.center();
        //console.log(center);
      }
    }
    //console.log(ids);
    return ids;
  },
};
