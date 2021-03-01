import {ContractGrantRawModel} from '@services/contract/contract.model'
import {UserDataInterface} from '@services/user/user.interface'
import {GrantTypesEnum} from '@services/static/static.model'
import {ITextOptions} from '@services/text-options/text-options.interface'

export class TextOptions {

  /**
   * Создает экземпляр TextOptions.
   *
   * @constructor
   * @param grant - ContractGrantRawModel
   * @param userServiceData - UserDataInterface
   * @param contractType - GrantTypesEnum
   */
  constructor (
    private grant: ContractGrantRawModel,
    private userServiceData: UserDataInterface,
    private contractType: GrantTypesEnum,
  ) {

  }

  /**
   * Генерирует все параметры для label.
   *
   * @return ITextOptions.IGenerateAll.
   */
  public generateAll (): ITextOptions.IGenerateAll {
    return {
      winnerName: this.getWinnerName(),
      count: this.getCount(),
      amount: this.getAmount(),
      score: this.getScore(),
      allTeamVoteScore: this.getAllTeamVoteScore(),
      solutionCount: this.getSolutionCount(),
      teamVoteScore: this.getTeamVoteScore(),
      grantVoteScore: this.getGrantVoteScore(),
    }
  }

  /**
   * Генерирует winnerName.
   *
   * @return Возвращает строку с именем команды или с id команды.
   */
  public getWinnerName (): string {
    switch (this.contractType) {
      case GrantTypesEnum.disruptive:
        let performerName = ''
        if (this.grant?.app) {
          for (const key of Object.keys(this.grant?.app)) {
            if (this.grant.app[key].process && this.grant.app[key].name && this.grant.app[key].name.value) {
              performerName = this.grant.app[key].name.value
            }
          }
        }
        return performerName
      case GrantTypesEnum.web3:
        return this.grant.leader?.value || ''
      default:
        let winnerName = ''
        if (this.grant?.app) {
          for (const key of Object.keys(this.grant?.app)) {
            if (this.grant.app[key].process?.value === 'winner') {
              winnerName = this.grant.app[key].name.value
            }
          }
        }
        return winnerName
    }
  }

  /**
   * Генерирует count.
   *
   * @return Возвращает строку с количеством команд которые подали заявку на участие.
   */
  public getCount (): string {
    return (this.grant?.app && Object.keys(this.grant?.app).length || '0').toString()
  }

  /**
   * Генерирует amount.
   *
   * @return Возвращает строку с количеством проголосовавших.
   */
  public getAmount (): string {
    return this.grant?.voting?.amount?.value || '0'
  }

  /**
   * Генерирует score.
   *
   * @return Возвращает строку с количеством голосов.
   */
  public getScore (): string {
    return this.grant?.voting?.state?.value || '0'
  }

  /**
   * Генерирует allTeamVoteScore.
   *
   * @return Возвращает строку с общим количеством голосов за все команды.
   */
  public getAllTeamVoteScore (): string {
    let res = 0
    if (this.grant?.app) {
      for (const key of Object.keys(this.grant?.app)) {
        res += parseInt(this.grant?.app[key]?.votes?.value || '0', 10)
      }
    }
    return res.toString()
  }

  /**
   * Генерирует solutionCount.
   *
   * @return Возвращает строку с общим количеством решений.
   */
  public getSolutionCount (): string {
    let res = 0
    if (this.grant?.app) {
      for (const key of Object.keys(this.grant?.app)) {
        if (this.grant?.app[key]?.solution?.value) {
          res++
        }
      }
    }
    return res.toString()
  }

  /**
   * Генерирует teamVoteScore.
   *
   * @return Возвращает строку количеством с голосов за решение.
   */
  public getTeamVoteScore (): string {
    if (this.grant?.app) {
      for (const key of Object.keys(this.grant?.app)) {
        if (this.grant?.app[key]?.process?.value) {
          return this.grant?.app[key]?.score?.value || '0'
        }
      }
    }
    return '0'
  }

  /**
   * Генерирует grantVoteScore.
   *
   * @return Возвращает строку количеством с голосов за грает.
   */
  public getGrantVoteScore (): string {
    return this.grant.voting?.amount?.value.toString() || '0'
  }

}
