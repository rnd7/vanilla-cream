# VC - Vanilla Cream Module
Minimalist Web Component Framework

**Important Notice:**
This is experimental technology. If you use this software, it is up to you to assess the risks.

# Import directly from GitHub io

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


# Using a package manager
This is optional. You may prefer this if you want to serve the sources yourself.

```
npm -i @rnd7/vc
```
```javascript
import Component from '@rnd7/vc'
```

# Import from CDN
In other cases you maybe want to use a CDN
```javascript
import Component from "https://esm.sh/@rnd7/vc"
```


# Obtain source code
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


# Usage

## Custom Components
Create your own Components by extending the Component class
```javascript
import Component from '@rnd7/vc'

class MyComponent extends Component {
    async initialize() {
        this.shadowRoot.textContent = "Hello World"
        super.initialize()
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
        await super.initialize()
    }

    updateState(state) {
        if (super.updateState(state)) {
            // only render when state changed
            this.addToRenderQueue(this.bind(this.#render))
        }
    }

    #render() {
        this.#headlineElement.textContent = this.state
    }
}

const myReactiveComponent = MyReactiveComponent.create({state: "Initial"})

document.body.append(myReactiveComponent)

myReactiveComponent.updateState("Modified")
```

To activate automated state management pass options with a interceptState property to the Component constructor from your Component sub class.


## More Examples
Have a look at the examples in the root directory of this repository.

[Repository root](../README.md)

# Files

## Classes

| file | name | purpose
|--- |--- |---
| component.js | Component | base class for custom components
| component-list.js |  ComponentList | Generic component to automatically render lists as components



## Functions

|file |function | purpose
|--- |--- |---
| handle-state-event.js | handleStateEvent | Automatic state management based on DOM events.
| update-element-list.js | updateElementList | Manages child components in the DOM
| update-element-list-state.js | updateElementListState | Propagates the state to DOM element children

## Constants

### Events
|file |event | purpose
|--- |--- |---
| event.js | MODIFY_STATE | Custom event type to apply state changes
| event.js | FETCH | Custom event type to fetch resources

###  State modification operation type
|file |type | purpose
|--- |--- |---
| event.js | REMOVE_STATE | Remove a state branch by reference
| event.js | REPLACE_STATE | Replace state branch by reference