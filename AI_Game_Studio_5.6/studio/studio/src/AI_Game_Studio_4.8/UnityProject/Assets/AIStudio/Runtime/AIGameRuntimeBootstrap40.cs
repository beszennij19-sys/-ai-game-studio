using UnityEngine;

namespace AIStudio {
    public class AIGameRuntimeBootstrap40 : MonoBehaviour {
        public string projectId = "PROJECT-UNSET";
        public AIGameRuntime40 runtime;

        void Awake() {
            runtime = GetComponent<AIGameRuntime40>();
            if (runtime == null) runtime = gameObject.AddComponent<AIGameRuntime40>();
            runtime.Configure(projectId);
        }
    }
}
