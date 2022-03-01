import {Asset} from "expo-asset";
import {useEffect, useState} from "react";
import * as Font from "expo-font";

export type FontSource = Parameters<typeof Font.loadAsync>[0];
const usePromiseAll = (promises: Promise<void | void[] | Asset[]>[], cb: () => void) =>
    useEffect(() => {
        (async () => {
            await Promise.all(promises);
            cb();
        })();
    });

export const useLoadAssets = (assets: number[], fonts: FontSource): boolean => {
    const [ready, setReady] = useState(false);
    usePromiseAll(
        [Font.loadAsync(fonts), ...assets.map((asset) => Asset.loadAsync(asset))],
        () => setReady(true)
    );

    return ready;
};
