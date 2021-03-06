import nsFor from './namespace/index.js'
import { select } from 'd3-selection'

export const h = (elementName, attributes, ...args) => {
    try {

        const children = args.length ? [].concat(...args) : []

        if (attributes === null || attributes === undefined) {
            attributes = {}
        }

        //wrap in d3-selection, create data-join update function, & return container element.
        if (typeof elementName === 'function' && attributes.select === true) {
            const [container, element, key, enter, update, exit] = elementName()
            const selection = select(container)
            container.update = (data) => {
                selection
                    .selectAll(element)
                    .data(data, key)
                    .join(
                        enter,
                        update,
                        exit,
                    )
            }
            return container
        }
        if (typeof elementName === 'function' ) {
            return elementName({
                attributes,
                children
            })
        }

        const ns = attributes.xmlns || nsFor(elementName)
        let element = document.createElementNS(ns, elementName)
        
        if (!Object.keys(attributes).length && children == undefined) {
            return element
        }

        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child))
            } else if (child instanceof Array === true) {
                child.forEach(item => element.appendChild(item))
            } else {
                element.appendChild(child)
            }
        })

        for (const key in attributes) {
            const value = attributes[key]
            if (value === undefined || key === 'xmlns' || key === 'select') {
                continue
            }
            if (key === 'className') {
                value.split(" ").forEach(c => element.classList.add(c))
                continue
            }
            if (key === 'eventListener') {
                element.addEventListener(...value)
                continue
            }
            if (key === 'eventListeners') {
                value.forEach(listener => element.addEventListener(...listener))
                continue
            }
            element.setAttribute(key, value)
        }

        return element
    } catch (error) {
        console.log(error)
    }
}

export const f = ({ children }) => {
    try {
        const fragment = document.createDocumentFragment()
        children.forEach(child => {
            if (child instanceof Array === true) {
                child.forEach(item => fragment.appendChild(item))
            } else if (typeof child === 'string') {
                fragment.appendChild(document.createTextNode(child))
            } else {
                fragment.appendChild(child)
            }
        })
        return fragment
    } catch (error) {
        console.log(error)
    }
}
