using UnityEngine;

public enum AINpcState { Idle, Patrol, Follow, Chase, Flee }

public class AIGameNpcSystem : MonoBehaviour
{
    public string npcId = "npc_01";
    public AINpcState state = AINpcState.Idle;
    public Transform player;
    public float detectionDistance = 8f;
    public float speed = 2f;

    void Update()
    {
        if (player == null) return;
        float d = Vector3.Distance(transform.position, player.position);
        if (state == AINpcState.Chase && d > 1.5f)
            transform.position = Vector3.MoveTowards(transform.position, player.position, speed * Time.deltaTime);
        else if (state == AINpcState.Follow && d > 3f)
            transform.position = Vector3.MoveTowards(transform.position, player.position, speed * Time.deltaTime);
    }
}
