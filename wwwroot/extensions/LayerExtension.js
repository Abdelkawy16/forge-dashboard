import { BaseExtension } from "./BaseExtension.js";
import { LayerPanel } from "./LayerPanel.js";

class LayerExtension extends BaseExtension {
  constructor(viewer, options) {
    super(viewer, options);
    this._layerbutton = null;
    this._layerPanel = null;
    this._layers = new Set([]);
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
    this.findLeafNodes(model)
    .then((dbids) => {
      model.getBulkProperties(
        dbids,
        {},
        (results) => {
          results.forEach((result) => {
            const r = result.name.replace(/\[\d+]/g, "");
            this._layers.add(r);
          });
          console.log(this._layers);
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
  }
}


Autodesk.Viewing.theExtensionManager.registerExtension(
  "LayerExtension",
  LayerExtension
);
