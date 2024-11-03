export default function updateElementListState(host, list) {
    if (!host) return
    for (let i = 0; i<host.children.length; i++) {
        host.children[i].updateState(list[i])
    }
}