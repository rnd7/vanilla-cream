export default function updateElementList(host, cls, list, { options={}, prefix=""} = {}) {
    if (!host) return
    list = list || []
    while (host.children.length > list.length) {
        host.lastChild.dispose()
    }
    if (!cls) return
    for (let i = host.children.length; i < list.length; i++) {
        const comp = cls.create({state: list[i], options, prefix})
        host.append(comp)
    }
}