export const $ = (nodo, isAll, documento = document.body) => isAll ? documento.querySelectorAll(nodo) : documento.querySelector(nodo);