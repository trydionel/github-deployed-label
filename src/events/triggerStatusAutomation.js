const IDENTIFIER = "jeff-at-aha.github-deployed-label"

function applyTag(record) {
  if (record.typename === 'Requirement') {
    console.log("FIXME: updateRequirement mutation does not accept tagList. Cannot apply tag.")
  } else {
    aha.graphMutate(`
      mutation AddDeployedTag($id: ID!) {
        update${record.typename}(attributes: {tagList: "Deployed"}, id: $id) {
          errors {
            attributes {
              fullMessages
            }
          }
        }
      }
    `, {
      variables: {
        id: record.id
      }
    })
  }
}

aha.on({ event: 'aha-develop.github.pr.labeled' }, ({ record, payload }) => {
  if (payload.label.name = 'Deployed') {
    console.log(`PR has a 'Deployed' label. Updating associated record: ${record.typename}-${record.id}.`)

    applyTag(record)
    aha.triggerAutomationOn(record, `${IDENTIFIER}.prDeployed`, true)
  }
});