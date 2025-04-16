export interface visitorResponseById {
    response: {
        returnNumber: number;
        errorMessage: string | null;
    };
    value: Visitor;
    }

    export interface Visitor {
        name?:string
        visitorId: number
        photo: string
        firstName: string
        lastName: string
        fileName: string
        phoneNumber: string
        email: string
        address: string,
        idProof:string,
        city: number
        state: number
        country: number
        category:number,
        entryBy: number
        entryDate: string
        schoolId: number
        siteId: number
        isBlocked: boolean
        isVIP: boolean
        typeOfVIP: number
        visitCount: number
        reason: any
        whomToMeet: number
        inviteId: number
      }

      interface City {
        name: string;
        id: number;
      }
      
      interface State {
        name: string;
        id: number;
        cities: City[];
      }
      
      export interface locationResponse {
        response: {
            returnNumber: number;
            errorMessage: string | null;
          };
          value: locData[];
      }
      
      interface locData {
        returnNumber: number
        errorMessage: any
      }

      export interface visitorResponse {
        response: {
            returnNumber: number;
            errorMessage: string | null;
        };
        value: Visitor[];
      }
      
export interface visitorCategoryResponse {
    response: categoryResponse
    value: categoryValue[]
}

export interface categoryResponse {
    returnNumber: number
    errorMessage: any
  }
  
  export interface categoryValue {
    value: string
    text: string
  }

export interface whooomeToMeetList {
    response: whooomeToMeetResponse
    value: whooomeToMeetValue[]
  }

  export interface whooomeToMeetResponse {
    returnNumber: number
    errorMessage: any
  }
  
  export interface whooomeToMeetValue {
    department: string
    email: string
    value: string
    text: string
  }