import {
  Button,
  Row,
  Col,
  Icon,
  Popup,
  Checkbox,
  CheckboxGroup,
  Cell,
  CellGroup,
  Field,
  NumberKeyboard,
  RadioGroup,
  Radio,
  Search,
  Switch,
  Loading,
  PullRefresh,
  List,
  Panel,
  Uploader,
  Toast,
  Dialog,
  Stepper,
  Picker,
  Tag,
  NoticeBar
} from 'vant'
export default class VantUI {
  init(_vue) {
    _vue.use(Button)
    _vue.use(Row)
    _vue.use(Col)
    _vue.use(Icon)
    _vue.use(Popup)
    _vue.use(Cell)
    _vue.use(CellGroup)
    _vue.use(Checkbox)
    _vue.use(CheckboxGroup)
    _vue.use(NumberKeyboard)
    _vue.use(RadioGroup)
    _vue.use(Search)
    _vue.use(Field)
    _vue.use(Radio)
    _vue.use(Switch)
    _vue.use(Loading)
    _vue.use(PullRefresh)
    _vue.use(List)
    _vue.use(Panel)
    _vue.use(Uploader)
    _vue.use(Picker)
    _vue.use(Stepper)
    _vue.use(Toast)
    _vue.use(Dialog)
    _vue.use(Tag)
    _vue.use(NoticeBar)
  }
}
