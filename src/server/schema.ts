import {buildSchema} from "graphql"
import {gql, useQuery} from "@apollo/client";


const schema = buildSchema(`
    type User {
        id: ID
        username: String
        
    
    }

`)

export {schema}