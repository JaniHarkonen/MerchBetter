# MerchBetter (v.0.1 ALPHA)

MerchBetter is an application solely desgined for taking notes while merching in OldSchool RuneScape (Notepad on steroids).
Notes are taken in the form of a sticker that holds the price at which to **buy** the item as well as the **selling** price. The
**profit margin** is then calculated and displayed to the left of the selling price. Setting the **GE-Limit** helps you calculate
the **total profit** that can be gained given the **margin**. The **name** of the item can be entered by double-clicking the title.
You can also see the **Grand Exchange cooldown** counter at the bottom of the sticker.
<br></br>
Each sticker also has a **state** meant to represent the state the trade is in currently. The state can either be *unset*, *open*,
*complete* or *aborted*.
<br></br>
**Unset** -- When a sticker is *unset*, its item is considered ready for trading.<br></br>
**Open**  -- *Open* stickers represent trades that are currently ongoing. Once a sticker is set to *open* the **Grand Exchange cooldown**
counter is set to **4 hours** and will gradually count down to zero updating **once a minute** if the sticker is not being manipulated.
It is recommended that users set the trade *open* once at least a single unit of the item has been bought to synchronize the application
clock with the in-game one.<br></br>
**Completed** -- Once a trade has been *completed*, that is all profit has been realized, it can be set to *completed* to indicate a
successful trade.<br></br>
**Aborted** -- If a trade cannot be carried out due to too slim profit margins or gapping, it can be set to *aborted*. It is recommended
that partially completed trades are considered *completed*, while trades that were not attempted or resulted in too high losses are
considered *aborted*.
<br></br>
Stickers can be placed by right-clicking the background and selecting **"New sticker"** from the drop-down menu. Via this method you can
also **reset the states of all the stickers** as well as **reset view zoom**.
