using UnityEngine;
using System.IO;

namespace AIStudio {
    public static class AIGameRuntimeSave40 {
        public static string SavePath(string projectId) {
            return Path.Combine(Application.persistentDataPath, "AIStudio", projectId, "runtime-save.json");
        }

        public static void Save(AIGameRuntime40 runtime) {
            if (runtime == null || string.IsNullOrEmpty(runtime.projectId)) return;
            string path = SavePath(runtime.projectId);
            Directory.CreateDirectory(Path.GetDirectoryName(path));
            File.WriteAllText(path, JsonUtility.ToJson(runtime.state, true));
        }

        public static bool Load(AIGameRuntime40 runtime) {
            if (runtime == null || string.IsNullOrEmpty(runtime.projectId)) return false;
            string path = SavePath(runtime.projectId);
            if (!File.Exists(path)) return false;
            runtime.state = JsonUtility.FromJson<AIGameRuntimeState40>(File.ReadAllText(path));
            return true;
        }
    }
}
