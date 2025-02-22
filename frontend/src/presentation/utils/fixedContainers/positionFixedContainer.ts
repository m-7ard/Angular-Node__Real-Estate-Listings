export default function positionFixedContainer(
    element: HTMLElement,
    reference: HTMLElement,
    positioning: Partial<Record<"top" | "left" | "bottom" | "right", string>>,
) {
    const referenceDimensions = reference.getBoundingClientRect();

    const parsedPositioning = { ...positioning };
    const elementWidth = element.offsetWidth;
    // element.style.minWidth = `${elementWidth}px`

    //
    Object.entries(positioning).forEach(([key, value]) => {
        if (value.includes("%") && ["left", "right"].includes(key)) {
            const typedKey = key as "left" | "right";
            parsedPositioning[typedKey] = reference.offsetWidth * (parseInt(value.slice(0, -1)) / 100) + "px";
        } else if (value.includes("%") && ["top", "bottom"].includes(key)) {
            const typedKey = key as "top" | "bottom";
            parsedPositioning[typedKey] = reference.offsetHeight * (parseInt(value.slice(0, -1)) / 100) + "px";
        }
    });

    //
    if (parsedPositioning.top != undefined) {
        element.style.top = `calc(${referenceDimensions.top}px + calc(${parsedPositioning.top}))`;
    } else {
        element.style.top = "";
    }
    if (parsedPositioning.left != undefined) {
        element.style.left = `calc(${referenceDimensions.left}px + calc(${parsedPositioning.left}))`;
    } else {
        element.style.left = "";
    }
    if (parsedPositioning.right != undefined) {
        element.style.right = `calc(${document.body.clientWidth - referenceDimensions.right}px + calc(${parsedPositioning.right}))`;
    } else {
        element.style.right = "";
    }
    if (parsedPositioning.bottom != undefined) {
        element.style.bottom = `calc(${document.body.clientHeight - referenceDimensions.bottom}px + calc(${parsedPositioning.bottom}))`;
    } else {
        element.style.bottom = "";
    }
}