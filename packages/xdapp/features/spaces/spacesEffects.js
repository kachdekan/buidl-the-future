import { smartContractCall } from 'xdapp/blockchain/blockchainHelper'
import { SPACES_STORE } from '../../consts'
import { getRoscaData, setRoscaDetails, fetchSpaces } from './spacesSlice'
import { SpaceListCache } from './spacesManager'
import { storeUserSpace } from 'xdapp/app/storage'
import { utils } from 'ethers'

export const spacesListeners = (startListening) => {
  startListening({
    actionCreator: getRoscaData,
    effect: async (action, listenerApi) => {
      const roscaAddr = action.payload
      const result = await smartContractCall('Rosca', {
        contractAddress: roscaAddr,
        method: 'getDetails',
        methodType: 'read',
      })
      const dueDate = new Date(result.nxtDeadline.toString() * 1000)
      const roscaDetails = {
        roscaName: result.roscaName,
        imgLink: result.imgLink,
        goalAmount: utils.formatUnits(result.goalAmount.toString(), 6),
        ctbDay: result.ctbDay,
        ctbOccur: result.ctbOccur,
        disbDay: result.disbDay,
        disbOccur: result.ctbOccur,
        dueDate: dueDate.toDateString(),
        activeMembers: utils.formatUnits(result.activeMembers.toString(), 0),
        currentRound: utils.formatUnits(result.currentRound.toString(), 0),
        creator: result.creator,
        roscaBal: utils.formatUnits(result.roscaBal.toString(), 6),
      }

      listenerApi.dispatch(setRoscaDetails(roscaDetails))
    },
  })
  startListening({
    actionCreator: fetchSpaces,
    effect: async (action, listenerApi) => {
      const results = await smartContractCall('Spaces', {
        method: 'getMySpaces',
        methodType: 'read',
      })
      results.forEach(async (result) => {
        const results = await smartContractCall('Rosca', {
          contractAddress: result[0],
          method: 'getDetails',
          methodType: 'read',
        })
        const dueDate = new Date(results.nxtDeadline.toString() * 1000)
        const spaceDetails = {
          address: result[0],
          name: result[1],
          type: result[2],
          value: utils.formatUnits(results.goalAmount.toString(), 6),
          repaid: utils.formatUnits(results.roscaBal.toString(), 6),
          dueDate: dueDate.toDateString(),
        }

        //console.log(spaceDetails)
        await storeUserSpace(SPACES_STORE, spaceDetails)
        Object.assign(SpaceListCache, { [spaceDetails.address]: spaceDetails })
      })
    },
  })
}
