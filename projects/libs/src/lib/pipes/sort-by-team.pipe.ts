/*
 *ngFor="let c of oneDimArray | sortBy:'asc'"
 *ngFor="let c of arrayOfObjects | sortBy:'asc':'propertyName'"
*/
import { Pipe, PipeTransform } from '@angular/core'
import * as _ from 'lodash'
import { ContractGrantAppModel } from '@services/contract/contract.model'

@Pipe({ name: 'sortByTeam' })
export class SortByTeamPipe implements PipeTransform {
  transform (value: ContractGrantAppModel[], order: string = 'asc'): ContractGrantAppModel[] {
    console.log(value)
    value = _.orderBy(value, ['votes', 'value'], [order === 'desc' ? order : 'asc'])
    value = _.orderBy(value, ['score', 'value'], [order === 'desc' ? order : 'asc'])
    value = _.sortBy(value, (e) => e?.score?.value || 0).reverse()
    return value
  }
}
