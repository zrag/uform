import React from 'react'
import PropsSetting from './propsSetting'
import { SchemaForm, Field } from '../../utils/baseForm'
import defaultGlobalCfgList from '../../configs/supportGlobalCfgList'

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      accordionList: this.getAccordionList()
    }
  }

  componentDidMount() {
    // this.setState({
    //   accordionList: this.getAccordionList()
    // })
  }

  generateGlobalCfgList = () => {
    // Merge custom form global property configuration
    const globalCfgList = [
      ...defaultGlobalCfgList,
      ...this.props.extraGlobalCfgList
    ]
    const _globalCfgList = []
    for (let i = globalCfgList.length - 1; i >= 0; i--) {
      if (
        !_globalCfgList.find(cfgItem => cfgItem.name === globalCfgList[i].name)
      ) {
        _globalCfgList.unshift(globalCfgList[i])
      }
    }
    return _globalCfgList
  }

  // global config
  renderGlobalConfig = () => {
    const globalCfgList = this.generateGlobalCfgList()

    const content = (
      <SchemaForm
        onChange={value => {
          this.props.changeGbConfig(value)
        }}
        defaultValue={this.props.gbConfig}
        labelAlign='left'
        labelTextAlign='left'
      >
        {globalCfgList.map(props => (
          <Field {...props} key={props.name} x-item-props={{ labelCol: 10 }} />
        ))}
      </SchemaForm>
    )

    return content
  }

  getAccordionList() {
    const list = [
      {
        title: '组件配置',
        content: (
          <PropsSetting
            supportConfigList={this.props.supportConfigList}
            renderEngine={this.props.renderEngine}
            UI={this.props.UI}
          />
        ),
        expanded: true
      }
    ]

    if (this.props.showGlobalCfg) {
      list.unshift({
        title: '全局配置',
        content: this.renderGlobalConfig(),
        expanded: true
      })
    }
    return list
  }

  render() {
    const { Accordion, version: UIVersion } = this.props.UI

    return UIVersion === '1.x' ? (
      <Accordion
        dataSource={this.state.accordionList}
        defaultExpandedKeys={['1']}
      />
    ) : (
      <Accordion
        dataSource={this.state.accordionList}
        onChange={(status, list) => {
          this.setState({
            accordionList: list
          })
        }}
      />
    )
  }
}
