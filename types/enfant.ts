export type Child = {
    id:                         string;
    assmatId:                   string;
    lastname:                   string;
    firstname:                   string;
    birthDate:                  string;
    avatarColor:                string;
    profilePictureUrl:           string;
    parentContactLastname:      string;
    parentContactFirstname:     string;
    parentContactEmail:         string;
    parentContactNumber:        string;
    invitationCode:             string;
    hourlyWageRate:             number;
    dailyAllowance:             number;
    createdAt:                  string;
    updatedAt:                  string;
}

export type PlannedChild = Child & {
    plannedStartTime:           string | null;
    plannedEndTime:             string | null;
}