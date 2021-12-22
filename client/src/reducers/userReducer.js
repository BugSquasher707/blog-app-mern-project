export const initialState = null

export const reducer = (state, action) => {
    switch(action.type){
        case "USER":
            return action.payload
        
        case "LOGOUT":
            return null
        
        default:
            return state
    }
}