export class LayerPanel extends Autodesk.Viewing.UI.DockingPanel {
  constructor(extension, id, title, options) {
    super(extension.viewer.container, id, title, options);
    this.extension = extension;
    this.container.style.left = (options.x || 0) + "px";
    this.container.style.top = (options.y || 0) + "px";
    this.container.style.width = (options.width || 500) + "px";
    this.container.style.height = (options.height || 800) + "px";
    this.container.style.resize = "both";
  }

  initialize() {
    this.title = this.createTitleBar(this.titleLabel || this.container.id);
    this.initializeMoveHandlers(this.title);

    this.container.appendChild(this.title);
    this.content = document.createElement("div");
    this.content.style.height = "auto";
    this.container.style.backgroundColor = "white";
    // add text to content container
    this.content.appendChild(document.createTextNode("Layer Panel"));
    this.container.appendChild(this.content);
  }

  update(model, layers) {
    const ul = document.createElement("ul");
    this.content.appendChild(ul);
    for (const item of layers) {
      const li = document.createElement("li");
      li.textContent = item;
      const hideButton = document.createElement("button");
      hideButton.textContent = "Hide Layer";

      hideButton.addEventListener("click", () => {
        this.hideLayer(item, model);
      });

      const showButton = document.createElement("button");
      showButton.textContent = "Show Layer";

      showButton.addEventListener("click", () => {
        this.showLayer(item, model);
      });

      li.appendChild(hideButton);
      li.appendChild(showButton);
      ul.appendChild(li);
    }
  }

  hideLayer(layerName, model) {
    this.extension.findLeafNodes(model)
    .then((dbids) => {
      model.getBulkProperties(
        dbids,
        {},
        (results) => {
          results.forEach((result) => {
            const r = result.name.replace(/\[\d+]/g, "");
            if(r == layerName){
                this.extension.viewer.hide(result.dbId);
            }
            
          });
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
  showLayer(layerName, model) {
    this.extension.findLeafNodes(model)
    .then((dbids) => {
      model.getBulkProperties(
        dbids,
        {},
        (results) => {
          results.forEach((result) => {
            const r = result.name.replace(/\[\d+]/g, "");
            if(r == layerName){
                this.extension.viewer.show(result.dbId);
            }
            
          });
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
