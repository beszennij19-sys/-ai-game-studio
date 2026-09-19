using System;
using UnityEngine;

[Serializable]
public class AIGamePipelineStage
{
    public string name;
    public string status;
}

[Serializable]
public class AIGamePipelineManifest
{
    public string pipelineVersion;
    public string projectId;
    public string status;
    public AIGamePipelineStage[] stages;
}

public class AIGameStudioPipeline : MonoBehaviour
{
    [Tooltip("Generated project identifier. Never mix data between Project IDs.")]
    public string projectId = "PROJECT-3-0-DEMO";
    public TextAsset pipelineJson;

    void Awake()
    {
        if (pipelineJson == null) return;
        var manifest = JsonUtility.FromJson<AIGamePipelineManifest>(pipelineJson.text);
        if (manifest != null && !string.IsNullOrEmpty(manifest.projectId))
            projectId = manifest.projectId;
    }

    public bool IsIsolatedFor(string requestedProjectId)
    {
        return string.Equals(projectId, requestedProjectId, StringComparison.Ordinal);
    }
}
