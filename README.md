# This repo is to show off Approach - Interface basic functionality.

Approach Interface defines a standard pipeline for interfacing your system. GUI, TUI, API, etc.

==

This repo is very likely to be a temporary vehicle, used to transfer useful concepts to HTMx.
Following this knowledge-share we will reattach the Approach mapper tools, prop library and update HTML patterns to use HTMx instead.

We will replace this repo's contents with demos of the Approach layers, eventually

==

# Basic Concepts

Approach Interface gives you the ability to launch AJAX requests purely from HTML, once including its JS module.
Checkout index.html and especially how it uses /static/js/approach.interface.js

The main functionality of approach.interface.js is wrapped up in the Interface prototype's $elf.call functions.
Most such functions match the document intent, such as: 
REFRESH, APPEND, PREPEND, REMOVE, etc..

The most important functions are:
- Interface.call.events
- Interface.call.Service
- Interface.call.Ajax


```
<div class="Interface">
  <h1>stuff</h1>
  <div>...</div>
  ...
  <ul class="controls MyToolbar">
    <li class="control" data-action="up.my_module"> &uarr; </li>
    <li class="control" data-action="down.my_module"> &darr; </li>
    <li class="control" data-action="left.my_module"> &larr; </li>
    <li class="control" data-action="right.my_module"> &rarr; </li>
    <li class="control" data-action="cool_event.my_module"> Click Me </li>
  </ul>
</div>
```

In this example, the div node with `class="Interface"` will be equipped with a new property via JS,
[element].Interface = new Interface();

This initialization will ultimately cause each `<li>` shown to throw a custom event when clicked, which you may catch with your own module.
By controlling a JSON object stored in data-context='{..}' you can coordinate state information between several modules, or simply use Inteface to signal events.

Interface object could be extended to make even more custom behavior, but for now just understand that all events caught be `.controls` inside a `.Interface` will be handled by that Interface object. This alone greatly reduces event processing. Additionally, controls will only bind listeners inside themselves to `.control` elements for specific events -- by default click.

Placing .controls near to your actual interface elements, meaning the literal elements which a user or other code interacts with, allows you to have the "best of both worlds" scenario when it comes to Event Bubbling vs Event Delegation. Improper delegation is a major cause of display lag.

This technique works equally well for web apps, mobile apps with XML layouts and even many desktop scenarios where applications are scriptable via JS. For non-JS/XML applications please contact us.

Let's hit a more robust example.

```
<div
  class='PickComponent control' 
  data-role='Service'
  data-intent='{  "PREFIX":  {  "Component":"Create"  }  }'
  data-context='{
    "_self_id":null,
    "_response_target":"getSelectedLayoutSlot()",
    "which_component": "TextEmbed"
  }'
>
 <div>
    <i class='bi bi-fonts'></i>
    <span>New Text Component</span>
  </label>
</div>
```

This HTML tells Interface

1. The role of this control is to launch a Service request call. Generally this means AJAX to a server.
2. Defines the call intent, which in total requires:

- Response Action: one of append, prepend, refresh/replace, remove/delete, before/prefix*, after/affix*, redirect and trigger. custom actions are possible.
- Request Command: anything your heart desires. Should always include at least 1 domain indicator followed by a command. This may be {"url/to/scope":"command"}, {"HumanConcept":"Complicated.CommandName"} or an array of these. Interpretted by your service handler. See Approach Service for a utlity implementation and a function registrar implementation. Approach Reflection API uses this as well.
- Request Support Payload: also anything your heart desires, but must pair precisely with the number of commands, or else be shared between them
- Response Target: What to do with the response? Either one of the the call.ActionName actions baked into Interface(), on a selector, or send the response to an AJAX handling function which well return a reference to a selection after doing whatever it wishes.

*before/after push elements outside of the target. append/prepend push elements inside the target.

# Considerations

We often think about breaking these up different, for example:

```
<div
 intent-response="PREPEND"
 intent-command="/Scope/Nested.Thing/Command"
 intent-support="{...}"
 intent-target=".Comments .Toolbar">
```

However, this slightly awkward form above allows:

- Multiple intents per request
- Multiple commands per intent
- Multiple support payloads
- Response is flexible enough either way
- Still not *that* hard to learn compared to HTML, but makes things very very flexible for tooling. Simple enough for humans, flexible enough for tooling.

There is an open request for comments simplifying this syntax without losing that ability.
Even purely being able to forward intents with null equivalent commands can be useful, for action sequencing.
Additionally the server / intent provider is able to request interaction with additional screen elements, based on context.

# Primary Attributes

data-action: submit to a specific server object/scope if on a form. if on a control, throws this custom event

data-role: autoform, event or by default service (ajax)

data-trigger: what this control can be triggered by (click, submit, or any native event)

data-intent: use available domain-specific intents based on attached service. common transport wrapper defined. allows for request types beyond GET, POST, PUSH, OPTIONS, etc

data-context: payload of this control

And considerations for:

- Efficient event bubbling from any control inside a controls, delegated to an ancestor Interface
- Multiple Interface groups, allowing multiple forms to aggregate according to action within a group  or submit distinct payloads in separate groups
- Include details at time of request describing what to do with the response, with a liiiitle bit more flexibility. We've stress tested this set since 2013 to find the most pluggable solution we could. Mainly boils down to append, prepend, refresh/replace, remove, before, after, redirect and trigger
- Response target can be selector or function

# Design Principles

Approach Interfaces consider visual Elements, visual "Props", visual Components as building blocks which compose layouts of a Screen.
Each Composition has/is a Stage with several Screen. While not bound to this precise structure: Compositions, Components and Props have special meaning to both code and design.

Composition: The actual document being composed, including all its assets, code formatting, scripts, styles, URI, context, etc

Component: A visual entity grouping some cohesive data, mapped by the backend and/or frontend scripting into some screen. Similar to an MVC view or Bootstrap component + data. Components always appear in groups, even if only a single Component is rendered. Doing so a this precise inflection point in the DOM allows drastically reducing the use of wrapper containers within Components

Props: Modals, Toolbars, Decorative visuals - generally things which are out of flow in a sense. They are tools which may be almost as complex as components. A form <input> control is arguably the most common prop, but they may be complex or single elements. They may have tokenizable data points and attributes. Props are generally stored in `#Stage #Offscreen.Screen #PropLibrary`

None of these specific markup requirements .. are actually required for the Interface system. However the Interface system was created to

- faciliate treating Component Groups as a stream of Components
- help Props move through their activity lifecycle, from the designer point of view rather than the developer
- avoid writing JS, but leave everything hookable so a developer can tie in their logic on response or tweak things preflight on request
- above all to depcrecate HTML form controls in favor of custom forms elements with their own Shadow-DOM and modular behavior
- exploit the understanding that all code functionality boils down to two thing:
  - resolving a command scope
  - supplying supporting arguments to that command scope
- support clueing in the server about what the client is trying to achieve, so response can change or simply forward this
  - may seem redundant, but does allow more flexibility in server response
  - easier to create client-side "servelet" which mimics the server application from XML/JSON feed caches on a CDN
  - takes inspiration from Video Ad standards such as VPAID and systems like KODI in order to abstract interactions and encourage navigation
