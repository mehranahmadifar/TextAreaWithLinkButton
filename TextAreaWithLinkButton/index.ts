import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class TextAreaWithLinkButton implements ComponentFramework.StandardControl<IInputs, IOutputs> {
  private container: HTMLDivElement;
  private input: HTMLInputElement;
  private button: HTMLButtonElement;
  private notifyOutputChanged: () => void;

  init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ) {
    this.notifyOutputChanged = notifyOutputChanged;
    this.container = container;

    // wrapper flex برای چسبیدن دکمه به input
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.width = "100%";
    wrapper.style.position = "relative";

    // input اصلی
    this.input = document.createElement("input");
    this.input.type = "text";
    this.input.style.flex = "1";
    this.input.style.height = "32px";
    this.input.style.padding = "0 8px";
    this.input.style.fontSize = "14px";
    this.input.style.border = "1px solid #d2d2d2";
    this.input.style.borderRadius = "2px";
    this.input.style.outline = "none";
    this.input.style.transition = "border-color 0.2s, box-shadow 0.2s";
    this.input.oninput = () => this.notifyOutputChanged();

    // focus و hover style مثل پاور اپز
    this.input.addEventListener("focus", () => {
      this.input.style.borderColor = "#0078d4"; // رنگ آبی پاور اپز
      this.input.style.boxShadow = "0 0 0 1px #0078d4 inset";
    });
    this.input.addEventListener("blur", () => {
      this.input.style.borderColor = "#d2d2d2";
      this.input.style.boxShadow = "none";
    });
    this.input.addEventListener("mouseover", () => {
      this.input.style.borderColor = "#a6a6a6";
    });
    this.input.addEventListener("mouseout", () => {
      this.input.style.borderColor = this.input === document.activeElement ? "#0078d4" : "#d2d2d2";
    });

    // دکمه آیکون لینک
    this.button = document.createElement("button");
    this.button.innerHTML = "🔗";
    this.button.style.height = "32px";
    this.button.style.width = "32px";
    this.button.style.border = "1px solid #d2d2d2";
    this.button.style.borderLeft = "none"; // چسبیدن به input
    this.button.style.borderRadius = "0 2px 2px 0";
    this.button.style.background = "#f4f4f4";
    this.button.style.cursor = "pointer";
    this.button.style.transition = "background 0.2s, border-color 0.2s";
    this.button.onmouseover = () => {
      this.button.style.background = "#eaeaea";
      this.button.style.borderColor = "#a6a6a6";
    };
    this.button.onmouseout = () => {
      this.button.style.background = "#f4f4f4";
      this.button.style.borderColor = "#d2d2d2";
    };
    this.button.onclick = () => {
      const value = this.input.value?.trim();
      if (value) {
        const url = value.startsWith("http") ? value : `https://${value}`;
        window.open(url, "_blank");
      }
    };

    wrapper.appendChild(this.input);
    wrapper.appendChild(this.button);
    container.appendChild(wrapper);
  }

  updateView(context: ComponentFramework.Context<IInputs>): void {
    this.input.value = context.parameters.sampleProperty.raw || "";
  }

  getOutputs(): IOutputs {
    return { sampleProperty: this.input.value };
  }

  destroy(): void {
    // no-op
  }
}
