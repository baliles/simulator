const _ = require('lodash')

require('./tooltip.component.less')

const tooltipComponent = {
  template: `
    <div ng-show="tooltip.open">
      <div class="tooltip-box" style="{{ ::tooltip.getBoxStyle() }}">
        <div ng-if="tooltip.showInput()">
          <div class="tooltip-value">
            <span>{{ tooltip.newValue }}</span>
            <span>{{ ::tooltip.options.unit }}</span>
          </div>
          <input class="tooltip-range-input"
                 type="range"
                 min="{{ ::tooltip.options.min }}"
                 max="{{ ::tooltip.options.max }}"
                 value="{{ ::tooltip.options.min }}"
                 ng-model="tooltip.newValue" ng-change="tooltip.update({value: tooltip.newValue })"/>
          <div class="tooltip-range">
            <span class="tooltip-range-min">{{ ::tooltip.options.min }}</span>
            <span class="tooltip-range-max">{{ ::tooltip.options.max }}</span>
          </div>
        </div>
        <div class="action-buttons">
          <div class="action-button" ng-repeat="action in tooltip.options.actions" ng-click="tooltip.update({ value: action.value })">{{ action.label }}</div>
        </div>
      </div>
      <svg class="tooltip-line"
        style="{{ tooltip.getLineStyle() }}"
        ng-attr-width="{{ ::tooltip.options.distance }}"
        height="3"
        viewPort="0 0 3 3">
        <line x1="0" y1="2" ng-attr-x2="{{ ::tooltip.options.distance }}" y2="2" />
      </svg>
    </div>

    <div ng-click="tooltip.toggle()" ng-class="{ active: tooltip.open }">
      <div class="tooltip-button"></div>
      <div class="tooltip-label" style="left: {{ ::tooltip.options.labelPosition.left }}px; top: {{ ::tooltip.options.labelPosition.top }}px;">
          {{ ::tooltip.label }}
      </div>
    </div>
  `,
  bindings: {
    options: '<',
    label: '<',
    value: '<',
    update: '&'
  },
  controllerAs: 'tooltip',
  /* @ngInject */
  controller ($element, $scope) {
    Object.assign(this.options, this.options.tooltip)

    $scope.$watch(() => {
      return this.value
    }, _.debounce((newValue) => {
      $scope.$applyAsync(() => {
        this.newValue = newValue
      })
    }, 100))

    $element.css({
      top: `${this.options.position.top}px`,
      left: `${this.options.position.left}px`
    })

    this.open = false
    this.toggle = (value) => {
      this.open = !this.open
    }

    this.getBoxStyle = () => {
      const { direction, distance } = this.options
      const sign = direction === 'right' || direction === 'bottom' ? '' : '-'
      const axis = direction === 'left' || direction === 'right' ? 'X' : 'Y'
      return `
        transform: -webkit-translat${axis}(${sign}${distance}px);
        transform: -moz-translate${axis}(${sign}${distance}px);
        transform: translate${axis}(${sign}${distance}px);
      `
    }

    this.getLineStyle = () => {
      const { direction } = this.options
      const rotation = {
        right: 0,
        bottom: 90,
        left: 180,
        top: 270
      }[direction]
      return `
        -webkit-transform: rotate(${rotation}deg);
        -moz-transform: rotate(${rotation}deg);
        transform: rotate(${rotation}deg);
        -webkit-transform-origin: left;
        -moz-transform-origin: left;
        transform-origin: left;
      `
    }

    this.showInput = () => {
      return (!this.options.actions || (this.options.actions && this.options.input)) &&
        _.isNumber(this.options.min) &&
        _.isNumber(this.options.max)
    }
  }
}

module.exports = tooltipComponent
