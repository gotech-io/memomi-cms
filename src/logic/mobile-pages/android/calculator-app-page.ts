import { AndroidAppPageBase } from '@testomate/framework'
import { Element } from 'webdriverio'

export class CalculatorAppPage extends AndroidAppPageBase {
  constructor() {
    super()
  }

  get plusElement(): Promise<Element> {
    return this.driver.$('id=com.google.android.calculator:id/op_add')
  }

  get numberOneElement(): Promise<Element> {
    return this.driver.$('id=com.google.android.calculator:id/digit_1')
  }

  get equalsElement(): Promise<Element> {
    return this.driver.$('id=com.google.android.calculator:id/eq')
  }

  get resultElement(): Promise<Element> {
    return this.driver.$('id=com.google.android.calculator:id/result_final')
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
