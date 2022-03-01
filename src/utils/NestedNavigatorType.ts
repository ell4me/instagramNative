import {StackNavigationProp} from "@react-navigation/stack";
import {ParamListBase, RouteProp, CompositeNavigationProp} from "@react-navigation/native";
import {BottomTabNavigationProp} from "@react-navigation/bottom-tabs";


export type ScreenParamsPropsType<ParamPrimaryTabList extends ParamListBase,
    ParamParentStackList extends ParamListBase,
    KeyParamPrimaryTabList extends keyof ParamPrimaryTabList = string> = {
    navigation: CompositeNavigationProp<  // @ts-ignore
        BottomTabNavigationProp<ParamPrimaryTabList, KeyParamPrimaryTabList>, StackNavigationProp<ParamParentStackList>>
    route: RouteProp<ParamPrimaryTabList, KeyParamPrimaryTabList>
}

