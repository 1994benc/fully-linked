export enum UpdateDataMode {
    /** Compare the ids of the items in the existing dataset and the new dataset to see which ones are new before applying updates to only the new ones. */
    compareItemIdsOnly = 'compareItemIdsOnly',
    /** Compare the properties of the items in the existing dataset and the new dataset to see which ones are new before applying updates to only the new ones. */
    deepCompare = 'deepCompare',
    /** Replace the entire data in the graph. No comparisions are made. This method is the fastest if there are many changes to be made. */
    replace = 'replace'
}