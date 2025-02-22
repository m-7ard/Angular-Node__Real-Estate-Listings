export default function fitFixedContainer(element: HTMLElement) {
    const elementDimensions = element.getBoundingClientRect();

    const bottomOverflow = elementDimensions.bottom > document.body.clientHeight;
    const topOverflow = elementDimensions.top < 0;
    const rightOverflow = elementDimensions.right > document.body.clientWidth;
    const leftOverflow = elementDimensions.left < 0;

    if (bottomOverflow) {
        element.style.bottom = "0px";
        element.style.top =
            element.offsetHeight >= document.body.offsetHeight
                ? "0px"
                : `${document.body.offsetHeight - elementDimensions.height}px`;
    }

    if (topOverflow) {
        element.style.top = "0px";
        element.style.bottom =
            element.offsetHeight >= document.body.offsetHeight
                ? "0px"
                : `${document.body.offsetHeight - elementDimensions.height}px`;
    }

    if (rightOverflow) {
        element.style.right = "0px";
        element.style.left =
            element.offsetWidth >= document.body.offsetWidth
                ? "0px"
                : `${document.body.offsetWidth - elementDimensions.width}px`;
    }

    if (leftOverflow) {
        element.style.left = "0px";
    }
}