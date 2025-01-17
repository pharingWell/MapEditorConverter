

"use strict";

var Vertical = `variables
{
    global:
        0: _extendedGlobalCollection
        1: _arrayConstructor
        2: AllPos
        3: AllDir
        4: firstpos
        5: secondpos
        6: firstpoint2
        7: secondpoint2
        8: second
        9: z
        10: Wall_ID
        11: showwalls
        12: destroyall
        13: _arrayConstructor_0
        14: is_Grounded
        15: g_beamType
        16: x
    player:
        0: _extendedPlayerCollection
        1: filterpos
        2: lastsavedpos
        3: closestbodypos
        4: fullbodypos
        5: prevpos_intersection
        6: active_wall
        7: closestwall
        8: x
        9: intersection_length
        10: thickness
}

// Extended collection variables:
// global [0]: _arrayConstructorStore

// Class identifiers:

rule("Initial Global")
{

    event
    {
        Ongoing - Global;
    }

    // Action count: 10
    actions
    {
        Set Global Variable(AllPos, Empty Array);
        Set Global Variable(AllDir, Empty Array);
        Set Global Variable(firstpos, Empty Array);
        Set Global Variable(secondpos, Empty Array);
        Set Global Variable(firstpoint2, Empty Array);
        Set Global Variable(secondpoint2, Empty Array);
        Set Global Variable(second, Empty Array);
        Set Global Variable(z, Empty Array);
        Set Global Variable(Wall_ID, Empty Array);
        Set Global Variable(g_beamType, Empty Array);
    }
}

rule("Initial Player")
{

    event
    {
        Ongoing - Each Player;
        All;
        All;
    }

    // Action count: 7
    actions
    {
        Set Player Variable(Event Player, filterpos, 0);
        Set Player Variable(Event Player, lastsavedpos, 0);
        Set Player Variable(Event Player, closestbodypos, 0);
        Set Player Variable(Event Player, fullbodypos, 0);
        Set Player Variable(Event Player, prevpos_intersection, 0);
        Set Player Variable(Event Player, active_wall, Empty Array);
        Set Player Variable(Event Player, closestwall, Empty Array);
    }
}

rule("Collision Logic")
{

    event
    {
        Ongoing - Each Player;
        All;
        All;
    }

    conditions
    {
        Has Spawned(Event Player) == True;
    }

    // Action count: 56
    actions
    {
        Set Player Variable(Event Player, lastsavedpos, Divide(Add(Eye Position(Event Player), Position Of(Event Player)), 2));
        Wait(0.016, Ignore Condition);
        Set Player Variable(Event Player, closestwall, Filtered Array(Global Variable(AllPos), Or(Or(Compare(Distance Between(Value In Array(Global Variable(AllPos), Current Array Index), Event Player), <=, Distance Between(Value In Array(Global Variable(AllPos), Current Array Index), Value In Array(Global Variable(firstpos), Current Array Index))), Compare(Value In Array(Player Variable(Event Player, active_wall), Current Array Index), ==, 1)), Compare(Compare(Dot Product(Direction Towards(Current Array Element, Player Variable(Event Player, lastsavedpos)), Value In Array(Global Variable(AllDir), Current Array Index)), >, 0), !=, Compare(Dot Product(Direction Towards(Current Array Element, Event Player), Value In Array(Global Variable(AllDir), Current Array Index)), >, 0)))));
        For Player Variable(Event Player, x, 0, Count Of(Player Variable(Event Player, closestwall)), 1);
        	Set Global Variable(z, Index Of Array Value(Global Variable(AllPos), Value In Array(Player Variable(Event Player, closestwall), Player Variable(Event Player, x))));
        	If(Or(Or(Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 1), Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 3)), Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 5)));
        		If(And(Compare(Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), >=, Y Component Of(Position Of(Event Player))), Compare(Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), <=, Y Component Of(Add(Eye Position(Event Player), Vector(Empty Array, 0.2, Empty Array))))));
        			Set Player Variable(Event Player, closestbodypos, Value In Array(Global Variable(firstpos), Global Variable(z)));
        		Else If(And(Compare(Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))), >=, Y Component Of(Position Of(Event Player))), Compare(Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))), <=, Y Component Of(Add(Eye Position(Event Player), Vector(Empty Array, 0.2, Empty Array))))));
        			Set Player Variable(Event Player, closestbodypos, Value In Array(Global Variable(secondpos), Global Variable(z)));
        		Else;
        			Set Player Variable(Event Player, closestbodypos, Position Of(Event Player));
        		End;
        		Set Player Variable(Event Player, fullbodypos, Vector(X Component Of(Eye Position(Event Player)), Y Component Of(Player Variable(Event Player, closestbodypos)), Z Component Of(Eye Position(Event Player))));
        		Set Player Variable(Event Player, filterpos, Add(Player Variable(Event Player, fullbodypos), Divide(Multiply(Value In Array(Global Variable(AllDir), Global Variable(z)), Dot Product(Subtract(Value In Array(Global Variable(AllPos), Global Variable(z)), Player Variable(Event Player, fullbodypos)), Value In Array(Global Variable(AllDir), Global Variable(z)))), Dot Product(Value In Array(Global Variable(AllDir), Global Variable(z)), Value In Array(Global Variable(AllDir), Global Variable(z))))));
        		If(Or(Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 1), Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 3)));
        			If(Compare(Compare(Dot Product(Direction Towards(Value In Array(Global Variable(AllPos), Global Variable(z)), Player Variable(Event Player, lastsavedpos)), Value In Array(Global Variable(AllDir), Global Variable(z))), >, 0), !=, Compare(Dot Product(Direction Towards(Value In Array(Global Variable(AllPos), Global Variable(z)), Player Variable(Event Player, fullbodypos)), Value In Array(Global Variable(AllDir), Global Variable(z))), >, 0)));
        				Set Player Variable(Event Player, intersection_length, Divide(Dot Product(Subtract(Value In Array(Global Variable(AllPos), Global Variable(z)), Player Variable(Event Player, fullbodypos)), Value In Array(Global Variable(AllDir), Global Variable(z))), Dot Product(Direction Towards(Player Variable(Event Player, lastsavedpos), Player Variable(Event Player, fullbodypos)), Value In Array(Global Variable(AllDir), Global Variable(z)))));
        				Set Player Variable(Event Player, prevpos_intersection, Add(Player Variable(Event Player, fullbodypos), Multiply(Multiply(Direction Towards(Player Variable(Event Player, lastsavedpos), Player Variable(Event Player, fullbodypos)), Vector(1, Empty Array, 1)), Player Variable(Event Player, intersection_length))));
        				If(And(And(And(Compare(Dot Product(Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))))), Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Player Variable(Event Player, prevpos_intersection))), >=, 0), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))))), Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Player Variable(Event Player, prevpos_intersection))), >=, 0)), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))))), Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Player Variable(Event Player, prevpos_intersection))), >=, 0)), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))))), Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Player Variable(Event Player, prevpos_intersection))), >=, 0)));
        					Cancel Primary Action(Event Player);
        					Teleport(Event Player, Add(Player Variable(Event Player, prevpos_intersection), Multiply(Multiply(Direction Towards(Player Variable(Event Player, prevpos_intersection), Player Variable(Event Player, lastsavedpos)), Vector(1, Empty Array, 1)), 2)));
        				End;
        			End;
        		End;
        		Set Player Variable(Event Player, thickness, 0);
        		If(Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 5));
        			Set Player Variable(Event Player, thickness, 4);
        		Else;
        			Set Player Variable(Event Player, thickness, 1);
        		End;
        		If(And(And(And(And(Compare(Distance Between(Player Variable(Event Player, fullbodypos), Player Variable(Event Player, filterpos)), <=, Player Variable(Event Player, thickness)), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))))), Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Player Variable(Event Player, filterpos))), >=, 0)), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))))), Direction Towards(Value In Array(Global Variable(firstpos), Global Variable(z)), Player Variable(Event Player, filterpos))), >=, 0)), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))))), Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Player Variable(Event Player, filterpos))), >=, 0)), Compare(Dot Product(Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(z))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(z))))), Direction Towards(Value In Array(Global Variable(secondpos), Global Variable(z)), Player Variable(Event Player, filterpos))), >=, 0)));
        			If(Not(Global Variable(is_Grounded)));
        				Set Gravity(Event Player, 100);
        			End;
        			If(Compare(Value In Array(Player Variable(Event Player, active_wall), Global Variable(z)), ==, False));
        				Set Player Variable At Index(Event Player, active_wall, Global Variable(z), 1);
        				If(And(Or(Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 1), Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 3)), Compare(Global Variable(is_Grounded), ==, False)));
        					Set Gravity(Event Player, 100);
        				Else If(Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 5));
        					Disable Movement Collision With Environment(Event Player, False);
        				End;
        			End;
        			If(Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 1));
        				Apply Impulse(Event Player, Multiply(Direction Towards(Player Variable(Event Player, filterpos), Player Variable(Event Player, fullbodypos)), Vector(1, Empty Array, 1)), 0.001, To World, Cancel Contrary Motion);
        				Set Move Speed(Event Player, Subtract(100, Multiply(Dot Product(Direction Towards(Eye Position(Event Player), Add(Eye Position(Event Player), World Vector Of(Throttle Of(Event Player), Event Player, Rotation))), Multiply(Direction Towards(Player Variable(Event Player, filterpos), Player Variable(Event Player, fullbodypos)), -1)), 100)));
        			Else If(Compare(Value In Array(Global Variable(Wall_ID), Global Variable(z)), ==, 3));
        				Apply Impulse(Event Player, Direction Towards(Player Variable(Event Player, filterpos), Player Variable(Event Player, fullbodypos)), Speed Of(Event Player), To World, Cancel Contrary Motion);
        			End;
        		Else;
        			Set Player Variable At Index(Event Player, active_wall, Global Variable(z), 0);
        			Set Move Speed(Event Player, 100);
        		End;
        	End;
        End;
        Loop;
    }
}

rule("Reset")
{

    event
    {
        Ongoing - Each Player;
        All;
        All;
    }

    conditions
    {
        Count Of(Filtered Array(Player Variable(Event Player, active_wall), Compare(Current Array Element, !=, 0))) == 0;
    }

    // Action count: 1
    actions
    {
        Enable Movement Collision With Environment(Event Player);
    }
}

rule("Effect Creation")
{

    event
    {
        Ongoing - Global;
    }

    // Action count: 28
    actions
    {
        Wait(5, Ignore Condition);
        If(Global Variable(showwalls));
        	For Global Variable(x, 0, Count Of(Global Variable(AllPos)), 1);
        		If(Compare(Value In Array(Global Variable(Wall_ID), Global Variable(x)), ==, 5));
        			Create Beam Effect(All Players(Team(All)), Good Beam, Value In Array(Global Variable(firstpos), Global Variable(x)), Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(x)))), Color(Red), None);
        			Create Beam Effect(All Players(Team(All)), Good Beam, Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(x)))), Add(Value In Array(Global Variable(secondpos), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Color(Red), None);
        			Create Beam Effect(All Players(Team(All)), Good Beam, Add(Value In Array(Global Variable(firstpos), Global Variable(x)), Vector(0.001, Empty Array, Empty Array)), Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(x)))), Color(Red), None);
        			Create Beam Effect(All Players(Team(All)), Good Beam, Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(x)))), Add(Value In Array(Global Variable(secondpos), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Color(Red), None);
        		Else;
        Skip(Value In Array(Array(14, 0, 5, 10), Add(Index Of Array Value(Array(1, 2, 3), Value In Array(Global Variable(g_beamType), Global Variable(x))), 1)));
        			Create Beam Effect(All Players(Team(All)), Grapple Beam, Value In Array(Global Variable(firstpos), Global Variable(x)), Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(x)))), Color(Aqua), None);
        			Create Beam Effect(All Players(Team(All)), Grapple Beam, Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(x)))), Add(Value In Array(Global Variable(secondpos), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Color(Aqua), None);
        			Create Beam Effect(All Players(Team(All)), Grapple Beam, Add(Value In Array(Global Variable(firstpos), Global Variable(x)), Vector(0.001, Empty Array, Empty Array)), Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(x)))), Color(Aqua), None);
        			Create Beam Effect(All Players(Team(All)), Grapple Beam, Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(x)))), Add(Value In Array(Global Variable(secondpos), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Color(Aqua), None);
        Skip(9);
        			Create Beam Effect(All Players(Team(All)), Good Beam, Value In Array(Global Variable(firstpos), Global Variable(x)), Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(x)))), Color(Aqua), None);
        			Create Beam Effect(All Players(Team(All)), Good Beam, Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(x)))), Add(Value In Array(Global Variable(secondpos), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Color(Aqua), None);
        			Create Beam Effect(All Players(Team(All)), Good Beam, Add(Value In Array(Global Variable(firstpos), Global Variable(x)), Vector(0.001, Empty Array, Empty Array)), Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(x)))), Color(Aqua), None);
        			Create Beam Effect(All Players(Team(All)), Good Beam, Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(x)))), Add(Value In Array(Global Variable(secondpos), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Color(Aqua), None);
        Skip(4);
        			Create Beam Effect(All Players(Team(All)), Bad Beam, Value In Array(Global Variable(firstpos), Global Variable(x)), Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(x)))), Color(Aqua), None);
        			Create Beam Effect(All Players(Team(All)), Bad Beam, Vector(X Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(secondpos), Global Variable(x)))), Add(Value In Array(Global Variable(secondpos), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Color(Aqua), None);
        			Create Beam Effect(All Players(Team(All)), Bad Beam, Add(Value In Array(Global Variable(firstpos), Global Variable(x)), Vector(0.001, Empty Array, Empty Array)), Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(x)))), Color(Aqua), None);
        			Create Beam Effect(All Players(Team(All)), Bad Beam, Vector(X Component Of(Value In Array(Global Variable(firstpos), Global Variable(x))), Y Component Of(Value In Array(Global Variable(secondpos), Global Variable(x))), Z Component Of(Value In Array(Global Variable(firstpos), Global Variable(x)))), Add(Value In Array(Global Variable(secondpos), Global Variable(x)), Vector(Empty Array, Empty Array, 0.001)), Color(Aqua), None);
        		End;
        		Wait(0.016, Ignore Condition);
        	End;
        End;
    }
}`
