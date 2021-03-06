# SchemaForm

## 介绍
基于Rs UForm的核心组件SchemaForm进一步扩展出来的SchemaForm组件，推荐生产环境下使用

## 依赖
```javascript
import {SchemaForm} from '@uform/next(antd)'

or 

import SchemaForm from '@uform/next(antd)'
```

## 原始API
| 属性名称 | 属性描述 | 属性类型 | 默认值 |
| --- | --- | --- | --- |
| defaultValue | 表单默认值 | Object |  |
| value | 表单值，受控态使用 | Object | {} |
| initialValues | 表单值，受控态使用 | Object | {} |
| locale | 表单国际化文案 | Object | {} |
| schema | 表单json schema，具体参考 [扩展规范](#/MpI2Ij/1gSGSDf5) | Object | {type:"object",properties:{}} |
| onChange | 表单变化事件回调 | `Function(values : Object){}` |  |
| onSubmit | 表单提交事件回调 | `Function(values : Object){}` |  |
| onReset | 表单重置事件回调 | `Function(values : Object){}` |  |
| onValidateFailed | 表单校验失败事件回调 | Function |  |
| editable | 控制表单字段是否可编辑状态 | `Boolean | Function(name : String) : Boolean` |  |
| actions | 需要握手的表单actions，只接收通过[createFormActions](#/aAUeUD/XEFAF7HoHV)创建出来的actions | Object |  |
| effects | 副作用处理函数 | Function |  |

## 副作用处理

> 表单副作用，也就是由表单字段的内部事件所产生的联动，校验，异步逻辑，如何更好的管理和维护副作用逻辑，恰好就是rxjs的最大优势，所以，我们采用了rxjs来管理副作用逻辑


前面API介绍中有讲到effects，这个effects是一个回调函数，它也是一个非常强大的回调函数，它接收了一个selector函数作为参数，我们可以用selector来选择表单内的任意一个字段，对其做状态修改，即便存在异步逻辑，也是可以很方便的在各种异步环境下对字段的状态做修改，所以，我们的表单联动，是不限于时空的。下面可以看一个简单的例子：

```jsx
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import SchemaForm, {
  registerFormField,
  Field,  
  connect,
  createFormActions
} from '@uform/react'

const actions = createFormActions()

registerFormField(
  'string',
  connect()(props => <input {...props} value={props.value || ''} />)
)


ReactDOM.render(
    <SchemaForm actions={actions} effects={($)=>{
       $('onFieldChange','aa').subscribe((fieldState)=>{
         actions.setFieldState('bb',state=>{
           state.value = fieldState.value
         })
       })
    }}>
       <Field type="string" name="aa"/>
       <Field type="string" name="bb"/>
    </SchemaForm>,
    document.getElementById('root')
)
```

上面的例子是实现aa在值改变的时候将bb的值设置为aa的值。

## 副作用事件
> 在上面的例子中使用到了事件选择器，事件源主要是以下几种类型


```javascript
<SchemaForm
    effects={($)=>{
       $("onFieldChange").subscribe((fieldState)=>{})
       $("onFormInit").subscribe((formState)=>{})
       $("onFormMount").subscribe((formState)=>{})
       $("onFormReset").subscribe((formState)=>{})
       $("onFormSubmit").subscribe((formState)=>{})
       $("onXXX").subscribe((xxx)=>{}) //自定义事件，主要通过dispatch函数来触发，后面都会提到哪里可以使用dispatch，比如Field组件的x-effect属性，FormConsumer里，FieldRenderProps里
    }}
/>
```


## 扩展API

| 属性名称 | 属性描述 | 属性类型 | 默认值 |
| --- | --- | --- | --- |
| inline | 是否是单行布局 | Boolean | false |
| size | 表单尺寸 <br /><br />可选值:<br />'large'(大)<br />'medium'(中)<br />'small'(小) | String | 'medium' |
| labelAlign | 标签的位置<br /><br />可选值:<br />'top'(上)<br />'left'(左)<br />'inset'(内) | String | 'left' |
| labelTextAlign | 标签的左右对齐方式<br /><br />可选值:<br />'left'(左)<br />'right'(右) | String |  |
| autoAddColon | 是否自动添加冒号 | Boolean |  |
| labelCol | 控制所有子节点的labelCol | Number | Object |  |
| wrapperCol | 控制所有子节点wrapperCol | Number | Object |  |
| prefix | className前缀 | String | 'next-' | 'antd-' |
| style | 样式对象 | Object |  |
| className | className | String |  |


## 用例
```javascript
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import SchemaForm, {
  FormButtonGroup,
  Field,  
  Submit
} from '@uform/next(antd)'


ReactDOM.render(
   <SchemaForm defaultValue={{aa:'123'}} onSubmit={values=>console.log(values)}>
     <Field name="aa" type="string" title="AA"/>
     <FormButtonGroup>
        <Submit>提交</Submit>
     </FormButtonGroup>
   </SchemaForm>
,document.getElementById('root'))
```
