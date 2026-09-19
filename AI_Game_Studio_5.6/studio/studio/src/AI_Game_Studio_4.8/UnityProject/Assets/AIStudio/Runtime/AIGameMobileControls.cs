using UnityEngine;
using UnityEngine.EventSystems;

public class AIGameMobileControls : MonoBehaviour, IPointerDownHandler, IPointerUpHandler, IDragHandler
{
    public Vector2 Move { get; private set; }
    public bool ActionPressed { get; private set; }

    public void OnPointerDown(PointerEventData e) { ActionPressed = true; OnDrag(e); }
    public void OnPointerUp(PointerEventData e) { ActionPressed = false; Move = Vector2.zero; }
    public void OnDrag(PointerEventData e) { Move = Vector2.ClampMagnitude(e.delta / 30f, 1f); }
}

public class AIGamePlayerController : MonoBehaviour
{
    public float speed = 4f;
    public AIGameMobileControls mobileControls;

    void Update()
    {
        Vector2 input = mobileControls != null ? mobileControls.Move :
            new Vector2(Input.GetAxisRaw("Horizontal"), Input.GetAxisRaw("Vertical"));
        Vector3 dir = new Vector3(input.x, 0, input.y);
        if (dir.sqrMagnitude > 0.001f)
            transform.position += dir.normalized * speed * Time.deltaTime;
    }
}
