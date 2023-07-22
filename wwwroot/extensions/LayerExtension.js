import { BaseExtension } from "./BaseExtension.js";
import { LayerPanel } from "./LayerPanel.js";
import { Utilities } from "./Utilities.js";

class LayerExtension extends BaseExtension {
  constructor(viewer, options) {
    super(viewer, options);
    this._layerbutton = null;
    this._layerPanel = null;
    this._layers = new Set([]);
    this._objects = [];
  }

  async load() {
    super.load();
    console.log("LayerExtension loaded.");
    return true;
  }

  unload() {
    super.unload();
    if (this._layerbutton) {
      this.removeToolbarButton(this._layerbutton);
      this._layerbutton = null;
    }
    if (this._layerPanel) {
      this._layerPanel.setVisible(false);
      this._layerPanel.uninitialize();
      this._layerPanel = null;
    }
    console.log("LayerExtension unloaded.");
    return true;
  }

  onToolbarCreated() {
    this._layerPanel = new LayerPanel(
      this,
      "dashboard-layres-panel",
      "Layers",
      { x: 0, y: 0 }
    );
    this._layerbutton = this.createToolbarButton(
      "dashboard-layers-button",
      "https://img.icons8.com/small/32/layers.png",
      "Show Layers"
    );
    this._layerbutton.onClick = () => {
      this._layerPanel.setVisible(!this._layerPanel.isVisible());
      this._layerbutton.setState(
        this._layerPanel.isVisible()
          ? Autodesk.Viewing.UI.Button.State.ACTIVE
          : Autodesk.Viewing.UI.Button.State.INACTIVE
      );
      if (this._layerPanel.isVisible() && this.viewer.model) {
        this._layerPanel.update(this.viewer.model, this._layers);
      }
    };
  }

  onModelLoaded(model) {
    super.onModelLoaded(model);
    if (this._layerPanel) {
      this.update(model);
    }
  }

  update(model) {
    const point = { x: 0, y: 0, z: 0 };
    
    const ids = Utilities.getElementsContainingPoint(this.viewer, point);
    
    this.findLeafNodes(model)
      .then((dbids) => {
        model.getBulkProperties(
          dbids,
          {},
          (results) => {
            results.forEach((result) => {
              //Utilities.getPositionOfNode(result, this.viewer, model);
              if(ids.has(result.dbId))
              {
                this._objects.push(result);
                //this.viewer.hide(result.dbId);
              }
              const r = result.name.replace(/\[\d+]/g, "");
              this._layers.add(r);
            });
            console.log(
              `Objects containing point (x:${point.x}, y:${point.y}, z:${point.z}) are: `,
              this._objects
            );
            //console.log(this._layers);
          },
          (err) => {
            console.error(err);
          }
        );
      })
      .catch((err) =>
        confirm(
          "Couldn't find leaf nodes. Do you want to load the whole model?"
        )
      );

      const meshes = Utilities.getMeshes(this.viewer);

      Utilities.getObjectsIntersectingRaycast(this.viewer, meshes);
  }

  // getPositionOfNode(element) {
  //   const boundingBox = this.viewer.utilities.getBoundingBox(element);

  //   const max = boundingBox.max;
  //   const min = boundingBox.min;

  //   const width = max.x - min.x;
  //   const height = max.y - min.y;
  //   const depth = max.z - min.z;

  //   const points = [
  //     { x: min.x, y: min.y, z: min.z }, // Min point
  //     { x: max.x, y: min.y, z: min.z },
  //     { x: min.x, y: max.y, z: min.z },
  //     { x: max.x, y: max.y, z: min.z },

  //     { x: min.x, y: min.y, z: max.z },
  //     { x: max.x, y: min.y, z: max.z },
  //     { x: min.x, y: max.y, z: max.z },
  //     { x: max.x, y: max.y, z: max.z }, // Max point
  //   ];

  //   console.log(`${element.name} has points of `, points);
  // }

  // pointIsInsideElement(element, point) {
  //   debugger;
  //   const { min, max } = this.viewer.utilities.getBoundingBox(element);

  //   const frags = this.viewer.model.getFragmentList();
  //   let bbox = new THREE.Box3();
  //   frags.getWorldBounds(fragId, bbox);
  //   console.log(`${element.name} has bound boxes of `, bbox);
  //   let center = bbox.center();
  //   console.log(center);

  //   return (
  //     point.x >= min.x &&
  //     point.x <= max.x &&
  //     point.y >= min.y &&
  //     point.y <= max.y &&
  //     point.z >= min.z &&
  //     point.z <= max.z
  //   );
  // }
}

Autodesk.Viewing.theExtensionManager.registerExtension(
  "LayerExtension",
  LayerExtension
);
