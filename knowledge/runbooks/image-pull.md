# Resolving ImagePullBackOff

Read the pod event before changing configuration.

## Checks

Confirm the image repository and immutable digest or tag exist. Inspect registry reachability and the name of the image pull Secret reference. Do not print credentials.

## Recovery

Publish or select the intended image through the delivery process, then verify the rollout.
