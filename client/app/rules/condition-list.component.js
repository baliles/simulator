const _ = require('lodash')

require('./condition-list.less')

/* @ngInject */
const conditionListComponent = {
  template: `
    <div class="condition-container">
      <div class="condition-block">
        <div class="mode-selector">
          if
          <select ng-model="conditionList.conditions.mode">
            <option>all</option>
            <option>any</option>
          </select>
          conditions are true
        </div>

        <div class="condition-row" ng-repeat="rule in conditionList.conditions.rules">
          <select class="min-width"
            ng-disabled="!$last && !rule.editing"
            ng-model="rule.template"
            ng-options="template.name for template in conditionList.templates track by template.id"
            ></select>
          <select class="min-width"
            ng-disabled="!$last && !rule.editing"
            ng-model="rule.channel"
            ng-options="channel.name for channel in rule.template.channels track by channel.id"
            ></select>
          <select class="min-width" ng-disabled="!$last && !rule.editing" ng-model="rule.operator">
            <option value="$lt"> &lt; </option>
            <option value="$lte">&lt;=</option>
            <option value="$gt">&gt;</option>
            <option value="$gte">&gt;=</option>
            <option value="$eq">=</option>
            <option value="$in">Contains</option>
            <option value="$nin">Doesn't contain</option>
          </select>
          <input type="text"  ng-disabled="!$last && !rule.editing" ng-model="rule.value" placeholder="value"/>
          <span ng-if="!$last">
            <button class="button secondary-outline"
              ng-class="{active: rule.editing}"
              ng-click="conditionList.editRule(conditionList.conditions.rules, $index)">
              Edit
            </button>
            <button class="button delete-outline"
              ng-click="conditionList.deleteRule($index)">
              Remove
            </button>
          </span>
          <button class="button primary-outline" type="submit"
            ng-click="conditionList.addRule(conditionList.conditions.rules)"
            ng-if="$last"
            ng-disabled="!rule.template || !rule.channel || !rule.value">
            + Add
          </button>
        </div>
      </div>

      <div class="condition-container" ng-repeat="condition in conditionList.conditions.additionalRules">
        <div class="mode-selector">
          if
          <select ng-model="condition.mode">
            <option>all</option>
            <option>any</option>
          </select>
          conditions are true
        </div>

        <div class="condition-row" ng-repeat="rule in condition.rules">
          <select class="min-width"
            ng-disabled="!$last && !rule.editing"
            ng-model="rule.template"
            ng-options="template.name for template in conditionList.templates"
            ></select>
          <select class="min-width"
            ng-disabled="!$last && !rule.editing"
            ng-model="rule.channel"
            ng-options="channel.name for channel in rule.template.channels"
            ></select>
          <!-- comparators -->
          <select class="min-width" ng-disabled="!$last && !rule.editing" ng-model="rule.operator">
            <option value="$lt"> &lt; </option>
            <option value="$lte">&lt;=</option>
            <option value="$gt">&gt;</option>
            <option value="$gte">&gt;=</option>
            <option value="$eq">=</option>
            <option value="$in">Contains</option>
            <option value="$nin">Doesn't contain</option>
          </select>
          <input type="text"  ng-disabled="!$last && !rule.editing" ng-model="rule.value" placeholder="value"/>
          <span ng-if="!$last">
            <button class="button secondary-outline"
              ng-class="{active: rule.editing}"
              ng-click="conditionList.editRule(condition.rules, $index)">
              Edit
            </button>
            <button class="button delete-outline"
              ng-click="conditionList.deleteRule($index)">
              Remove
            </button>
          </span>
          <button class="button primary-outline" type="submit"
            ng-click="conditionList.addRule(condition.rules)"
            ng-if="$last"
            ng-disabled="!rule.template || !rule.channel || !rule.value">
            + Add
          </button>
        </div>
        <div>
          <button class="button delete-outline" ng-click="conditionList.removeCombination($index)">Remove combination</button>
        </div>
      </div>

      <div class="condition-container">
        <button class="button primary-outline" type="submit"
          ng-click="conditionList.addAdditionalCombination()">
          + Add Combination
        </button>
      </div>
    </div>
  `,
  controllerAs: 'conditionList',
  bindings: {
    conditions: '=',
    templates: '<'
  },
  /* @ngInject */
  controller (devicesService) {
    const ruleTemplate = {
      operator: '$eq',
      editing: false
    }

    this.addAdditionalCombination = () => this.conditions.additionalRules.push({
      mode: 'any',
      rules: [_.clone(ruleTemplate)]
    })
    this.removeCombination = (idx) => this.conditions.additionalRules.splice(idx, 1)
    this.addRule = (array) => array.push(_.clone(ruleTemplate))
    this.deleteRule = (idx) => this.conditions.rules.splice(idx, 1)
    this.editRule = (array, idx) => {
      array[idx].editing = !array[idx].editing
    }
  }
}

module.exports = conditionListComponent
