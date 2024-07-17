export function applyFadeAnimationToChildrenOfParents() {
    const elements = document.querySelectorAll('#applyFadeAnimationToChildren');

    elements.forEach((element) => {
        applyFadeAnimationToChildren(element)
    });      
}

export function applyFadeAnimationToChildren(element=document.getElementById('applyFadeAnimationToChildren')) {
    let counter = 0
    element.childNodes.forEach(child => {
        setTimeout(() => {child.style.opacity = 1}, counter * 200)
        counter += 1
    });
}