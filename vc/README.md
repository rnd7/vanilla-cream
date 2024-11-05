# VC - Vanilla Cream | module
Minimalist Web Component Framework.

**Important Notice:**
This is experimental technology. If you use this software, it is up to you to assess the risks.

## Import directly from GitHub io

```html
<script type="importmap">
    {
        "imports": {
            "@rnd7/vc": "https://rnd7.github.io/vanilla-cream/vc/src/index.js"
        }
    }
</script> 
```

```javascript
import Component from '@rnd7/vc'
```

## Using a package manager
This is optional. You may prefer this if you want to serve the sources yourself.

```
npm -i @rnd7/vc
```
```javascript
import Component from '@rnd7/vc'
```

## Import from CDN
In other cases you maybe want to use a CDN
```javascript
import Component from "https://esm.sh/@rnd7/vc"
```


## Obtain source code
Git clone this repo and import the module.

```
git clone https://github.com/rnd7/vanilla-cream.git
```

```html
<script type="importmap">
    {
        "imports": {
            "@rnd7/vc": "./vc/src/index.js"
        }
    }
</script> 
```

```javascript
import Component from '@rnd7/vc'
```

If you still want to import the module using the path you can also directly import from source after cloning the repo.
```javascript
import Component from './vc/src/index.js'
```

## Named exports
The Component Class is the default export. In addition, the module also provides additional exports.

All named exports provided by the vc module
```javascript
import {
    Component,
    ComponentList, 
    handleStateEvent, 
    updateElementList, 
    updateElementListState, 
    MODIFY_STATE, 
    FETCH,
    REMOVE_STATE,
    REPLACE_STATE
} from '@rnd7/vc'
```


## Custom Components
Create your own Components by extending the Component class
```javascript
import Component from '@rnd7/vc'

class MyComponent extends Component {
    async initialize() {
        this.shadowRoot.textContent = "Hello World"
    }
}

document.body.append(MyComponent.create())
```

You cannot use the new keyword to instantiate the component. Instead use the static create method. The constructor is invoked by the browser. The initialize method is invoked on animation frame after the component is added to the DOM.



The resulting DOM tree looks like this. You can style, query and modify the component just like a regular HTML element. You can also access all public accessors and methods as you would do with regular class instance.
```
<body>
    <vc-my-component>
        #shadow-root
            "Hello World"
    </vc-my-component>
</body>
```


## Reactive state included

```javascript
import Component from '@rnd7/vc'

export default class MyReactiveComponent extends Component {
    #headlineElement = document.createElement("h1")
    constructor() {
        super({interceptState: true})
    }

    async initialize() {
        this.shadowRoot.append(this.#headlineElement) 
        this.on(this.#headlineElement, "pointerup", (event) => {
            this.replaceState("Clicked")
        })
    }

    stateChange() {
        this.addToRenderQueue(this.bind(this.#render))
    }

    #render() {
        this.#headlineElement.textContent = this.state
    }
}

const myReactiveComponent = MyReactiveComponent.create({
    state: "Initial"
})

document.body.append(myReactiveComponent)

myReactiveComponent.updateState("Click here")
```

To activate automated state management pass options with a interceptState property to the Component constructor from your Component sub class.


## More Examples
Have a look at the examples in the root directory of this repository.

[Repository root](https://github.com/rnd7/vanilla-cream)

[Interactive Examples](https://rnd7.github.io/vanilla-cream/README.md)


## The state
In principal the state can be any JavaScript type. Whether a node has changed is checked on the basis of strict equality. Although external control is also possible, I found it useful when a component is responsible for its own state and the descendants. To invalidate a section of the state, it can be shallow cloned and modified by a component. Subordinate references can be retained. If the node is a primitive, the value may simply be replaced. A ComponentList entry can remove itself by removing its own state.
Since state changes are propagated using composed DOM events that bubble up the DOM. The automated state management can identify the node in question and apply the changes to the superordinate nodes.

## Basic example

```javascript
import Component, { ComponentList } from '@rnd7/vc'

/* 
A plain JS Object as state is probably the most flexible solution
*/
let myState = {
    someProperty: false,
    nested: {
        nestedProperty: "Something"
    },
    list: [
        {
            listItemProperty: "First"
        },
        {
            listItemProperty: "Second"
        },
        {
            listItemProperty: "Third"
        }
    ]
}

class MyComponent extends Component {
    #label = document.createElement('div')
    #nestedComponent = NestedComponent.create()
    #listComponent = ComponentList.create({
        options: {
            component: ListItem
        }
    })

    constructor() {
        super({
            interceptState: true, 
        })
        this.stateMap = { 
            nested: { 
                nestedProperty: this.#nestedComponent
            },
            list: this.#listComponent
        }
    }

    async initialize() {
        this.shadowRoot.append(this.#label)
        this.shadowRoot.append(this.#nestedComponent)
        this.shadowRoot.append(this.#listComponent)
    }

    stateChange() {
        this.addToRenderQueue(()=>{
            this.#label.textContent = this.state.someProperty
        }) 
    }
}

class NestedComponent extends Component {
    async initialize() {
        this.on(this, "pointerup", ()=>{
            // Component level state modification
            const newValue = this.state === "Something"? "Anything": "Something"
            this.replaceState(newValue)
        })
    }

    stateChange() {
        this.addToRenderQueue(()=>{
            this.shadowRoot.textContent = this.state
        }) 
    }
}

class ListItem extends Component {
    stateChange() {
        this.addToRenderQueue(()=>{
            this.shadowRoot.textContent = this.state.listItemProperty
        })
    }
}

// A Component can optionally be initialized with a state
const myComponent = MyComponent.create({state: myState})

document.body.append(myComponent)

// External state modification

// To change the value of someProperty.
myState = {...myState, someProperty: true}
myComponent.updateState(myState)

// To change the list replace the array
myState.list = myState.list.slice(0,2)
myComponent.updateState(myState)

// To change a list item
myState.list[0] = {...myState.list[0], listItemProperty: "First Item"}
myComponent.updateState(myState)

// To change the other list item
myState.list[1] = {...myState.list[1], listItemProperty: "Second Item"}
myComponent.updateState(myState)

```

The interceptState option passed to the constructor turns on automatic state event handling. The stateMap is used to map the state to subordinate components. It is quite flexible use an array if you want to propagate the same state node to multiple entities. You can register Component instances or functions.


## Files
The main entry point is the vc/index.js file that provides the exports. In many cases, the Component and ComponentList classes are of primary importance. In addition, some functions are provided that can be particularly helpful when implementing individual state management.

### Classes

| file | name | purpose
|--- |--- |---
| component.js | Component | Base class for custom components
| component-list.js |  ComponentList | Generic component to automatically render lists as components


### Functions

|file |function | purpose
|--- |--- |---
| handle-state-event.js | handleStateEvent | Automatic state management based on DOM events.
| update-element-list.js | updateElementList | Manages child components in the DOM
| update-element-list-state.js | updateElementListState | Propagates the state to DOM element children

### Events
|file |event | purpose
|--- |--- |---
| event.js | MODIFY_STATE | Custom event type to apply state changes
| event.js | FETCH | Custom event type to fetch resources

### State modification operation type
|file |type | purpose
|--- |--- |---
| event.js | REMOVE_STATE | Remove a state branch by reference
| event.js | REPLACE_STATE | Replace state branch by reference