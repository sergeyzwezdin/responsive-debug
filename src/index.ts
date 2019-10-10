const rewriteMediaQuery = (source: string) => {
    const fontSize = parseFloat(window.getComputedStyle(document.body).getPropertyValue('font-size'));
    return source.replace(/[\d\.]+r?em/gi, (t) => `${t} / ${fontSize * parseFloat(t)}px`);
};

const throttle = function(type: string, name: string) {
    let running = false;
    window.addEventListener(type, () => {
        if (running) {
            return;
        }
        running = true;
        requestAnimationFrame(() => {
            window.dispatchEvent(new CustomEvent(name));
            running = false;
        });
    });
};

const buildRootElement: () => HTMLElement = () => {
    const root = document.createElement('div');
    root.style.margin = '0';
    root.style.padding = '8px';
    root.style.fontSize = '12px';
    root.style.position = 'fixed';
    root.style.top = '0';
    root.style.left = '0';
    root.style.width = '320px';
    root.style.backgroundColor = 'rgba(238, 238, 238, 0.8)';
    root.style.zIndex = '50000';
    root.style.pointerEvents = 'none';

    return root;
};

const enableDebug = (config: { name: string; mediaQuery: string }[]) => {
    const root = buildRootElement();

    const width = document.createElement('p');
    root.appendChild(width);

    const fontSize = document.createElement('p');
    root.appendChild(fontSize);

    const mediaQuery = document.createElement('p');
    root.appendChild(mediaQuery);

    throttle('resize', 'optimizedResize');

    const invalidate = () => {
        width.innerHTML = `Width: <b>${window.innerWidth}px</b>`;
        fontSize.innerHTML = `Font size: <b>${window.getComputedStyle(document.body).getPropertyValue('font-size')}</b>`;

        const matches = config.filter((c) => window.matchMedia(c.mediaQuery).matches);
        mediaQuery.innerHTML = `Media query: <ul style="margin: 0; padding: 0; list-style-type: none">${matches
            .map((m) => `<li><b>${m.name}</b>: ${rewriteMediaQuery(m.mediaQuery)}</li>`)
            .join('')}</ul>`;
    };

    window.addEventListener('optimizedResize', invalidate);

    invalidate();

    document.body.insertBefore(root, document.body.firstChild);
};

export default enableDebug;
