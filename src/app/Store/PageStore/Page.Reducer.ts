import { PageActionTypes ,PageActions} from './Page.Actions';

//export let initialState = []
// const newState = (state, newData) => {
//    
//     return Object.assign( state, newData);
// };
export function Pagereducer(state= [], action: PageActions) {
    
    switch (action.type) {
     
        case   PageActionTypes.Open_Page:
            {
    
               let Page = action.payload        
              

                return [...(state.filter((el:any)=>el.viewName !=Page.viewName))   , action.payload]
            
     
     
            }
     
  
        case PageActionTypes.Close_Page:
            { 
               
            let ViewName = action.payload        
            return state.filter((el:any)=>el.viewName != ViewName)
            }
       
        default: 
            return state
    }
}