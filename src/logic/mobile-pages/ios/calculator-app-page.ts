import { IosAppPageBase } from '@testomate/framework'
import { Element } from 'webdriverio'

export class CalculatorAppPage extends IosAppPageBase {
  constructor() {
    super()
  }

  get plusElement(): Promise<Element> {
    return this.driver.$('//XCUIElementTypeButton[@name="+"]')
  }

  get numberOneElement(): Promise<Element> {
    return this.driver.$('//XCUIElementTypeButton[@name="1"]')
  }

  get equalsElement(): Promise<Element> {
    return this.driver.$('//XCUIElementTypeButton[@name="="]')
  }

  get resultElement(): Promise<Element> {
    return this.driver.$(
      '//XCUIElementTypeApplication[@name="CalculatorClone"]/XCUIElementTypeWindow/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeStaticText',
    )
  }

  public async clickNumberOne(): Promise<void> {
    const numOne = await this.numberOneElement
    await numOne.click()
  }

  public async clickPlus(): Promise<void> {
    const plus = await this.plusElement
    await plus.click()
  }

  public async clickEquals(): Promise<void> {
    const equals = await this.equalsElement
    await equals.click()
  }
}
